import { Agent } from "@openai/agents";
import { RunInfo } from "@/lib/ai/types";
import { createImageTool, createVideoTool } from "@/lib/ai/tools";
import {
  imageGeneratorInstructions,
  createConversationInstructions,
  videoGeneratorInstructions,
} from "@/lib/ai/prompts";

const videoGeneratorAgent = new Agent<RunInfo>({
  name: "Video Generator",
  instructions: videoGeneratorInstructions,
  tools: [createVideoTool],
});

const imageGeneratorAgent = new Agent<RunInfo>({
  name: "Images Generator",
  instructions: imageGeneratorInstructions,
  tools: [createImageTool],
});

export const createConversationAgent = new Agent<RunInfo>({
  name: "Creative Assistant",
  instructions: createConversationInstructions,
  handoffs: [imageGeneratorAgent, videoGeneratorAgent],
});
