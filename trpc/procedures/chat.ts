import { createConversationAgent } from "@/lib/ai/agent";
import { Asset, RunInfo } from "@/lib/ai/types";
import { user, assistant, run, AgentInputItem } from "@openai/agents";
import { ChatResponse } from "@/types/messages";
import { AssetType, Role } from "@prisma/client";
import { prisma } from "@/lib/db";

const getActions = (history: AgentInputItem[]): string[] => {
  const actions = history.filter((item) => item.type === "function_call");
  return actions.map((action) => action.name);
};

export const chat = async (
  message: string,
  conversationId?: string,
  inputAssetId?: string
): Promise<ChatResponse> => {
  try {
    let conversation;
    if (!conversationId) {
      conversation = await prisma.conversation.create({
        data: {},
        include: {
          messages: true,
        },
      });
    } else {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          messages: true,
        },
      });
      if (!conversation) {
        throw new Error(`Conversation ${conversationId} not found`);
      }
    }
    let ctx: RunInfo = { assets: [] };
    const previousMessages = conversation.messages.map((message) => {
      if (message.role === Role.USER) {
        return user(message.content);
      } else {
        return assistant(message.content);
      }
    });
    let userMessage;
    if (inputAssetId) {
      const inputAsset = await prisma.asset.findUnique({
        where: { id: inputAssetId },
      });
      if (!inputAsset) {
        throw new Error(`Input asset ${inputAssetId} not found`);
      }
      ctx = { inputAssetUrl: inputAsset.url, ...ctx };
      userMessage = user([
        {
          type: "input_text",
          text: message,
        },
        {
          type: "input_image",
          image: inputAsset.url,
        },
      ]);
    } else {
      userMessage = user(message);
    }

    // convert messages to agent input items

    const modelMessages = [...previousMessages, userMessage];

    const response = await run(createConversationAgent, modelMessages, {
      context: ctx,
    });
    // create messages in db
    await prisma.message.createMany({
      data: [
        {
          role: Role.USER,
          content: message,
          conversationId: conversation.id,
        },
        {
          role: Role.ASSISTANT,
          content: response.finalOutput ?? "",
          conversationId: conversation.id,
        },
      ],
    });
    // create assets in db (not saved)
    await prisma.asset.createMany({
      data: ctx.assets.map((asset: Asset) => ({
        url: asset.url,
        type: asset.type.toUpperCase() as AssetType,
        conversationId: conversation.id,
      })),
    });

    // fetch the created assets
    const assets = await prisma.asset.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ctx.assets.length,
    });
    const actions = getActions(response.history.slice(previousMessages.length));
    return {
      message: {
        content: response.finalOutput ?? "",
        role: "assistant",
        ...(actions.length > 0 && { actions }),
      },
      assets: assets,
      conversationId: conversation.id,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
