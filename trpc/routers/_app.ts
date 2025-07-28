import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { chat } from "@/trpc/procedures/chat";
import { getAssets, getConversationAssets, saveAsset } from "../procedures/assets";
export const appRouter = createTRPCRouter({
  chat: baseProcedure
    .input(
      z.object({
        message: z.string(),
        conversationId: z.string().optional(),
        inputAssetId: z.string().optional(),
      })
    )
    .mutation((opts) => {
      return chat(
        opts.input.message,
        opts.input.conversationId,
        opts.input.inputAssetId
      );
    }),
  saveAsset: baseProcedure
    .input(z.object({ assetId: z.string() }))
    .mutation((opts) => {
      return saveAsset(opts.input.assetId);
    }),
  getConversationAssets: baseProcedure.input(z.object({ conversationId: z.string() })).query((opts) => {
    return getConversationAssets(opts.input.conversationId);
  }),
  getAssets: baseProcedure.query(() => {
    return getAssets();
  }),

});
export type AppRouter = typeof appRouter;
