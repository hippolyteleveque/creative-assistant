import { Asset } from "@prisma/client";

export interface Message {
  content: string;
  role: "user" | "assistant";
  actions?: string[];
}

export interface ChatResponse {
  message: Message;
  assets: Asset[];
  conversationId: string;
}
