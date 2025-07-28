import { z } from "zod";

const envSchema = z.object({
  REPLICATE_API_TOKEN: z.string(),
  REPLICATE_IMAGE_MODEL_ID: z.string(),
  REPLICATE_VIDEO_MODEL_ID: z.string(),
  OPENAI_API_KEY: z.string(),
  DATABASE_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid or missing environment variables");
}

export const config = parsedEnv.data;
