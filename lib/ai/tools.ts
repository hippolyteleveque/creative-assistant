import { tool, RunContext } from "@openai/agents";
import Replicate from "replicate";
import { config } from "@/lib/config";
import { RunInfo, ReplicateOutput } from "@/lib/ai/types";
import { z } from "zod";

const replicate = new Replicate({
  auth: config.REPLICATE_API_TOKEN,
});

export const createImageTool = tool({
  name: "Create Image",
  description: "Create an image based on the user prompt and optional image",
  parameters: z.object({ prompt: z.string() }),
  async execute({ prompt }, runContext?: RunContext<RunInfo>) {
    try {
      const imageUrl = runContext!.context.inputAssetUrl;
      const output = (await replicate.run(
        config.REPLICATE_IMAGE_MODEL_ID as `${string}/${string}`,
        {
          input: {
            prompt: prompt,
            ...(imageUrl && { image: imageUrl }),
          },
        }
      )) as ReplicateOutput[];
      runContext!.context.assets = runContext!.context.assets.concat([
        {
          type: "image",
          url: output[0].url().href,
        },
      ]);
      return "Image generated successfully";
    } catch (error) {
      console.error("Error generating image", error);
      return "Error generating image";
    }
  },
});

export const createVideoTool = tool({
  name: "Create Video",
  description: "Create a video based on the user prompt and optional image",
  parameters: z.object({ prompt: z.string() }),
  async execute({ prompt }, runContext?: RunContext<RunInfo>) {
    try {
      const imageUrl = runContext!.context.inputAssetUrl;
      const output = (await replicate.run(
        config.REPLICATE_VIDEO_MODEL_ID as `${string}/${string}`,
        {
          input: {
            prompt: prompt,
            ...(imageUrl && { image: imageUrl }),
          },
        }
      )) as ReplicateOutput;
      runContext!.context.assets = runContext!.context.assets.concat([
        {
          type: "video",
          url: output.url().href,
        },
      ]);
      return "Video generated successfully";
    } catch (error) {
      console.error("Error generating video", error);
      return "Error generating video";
    }
  },
});
