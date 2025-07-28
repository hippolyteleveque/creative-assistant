import { AgentInputItem } from "@openai/agents";

export interface Asset {
  type: "image" | "video";
  url: string;
}

export interface RunInfo {
  assets: Asset[];
  inputAssetUrl?: string;
}

export interface ReplicateOutput {
  url: () => { href: string };
}

export interface AgentResponse {
  message: string;
  context: RunInfo;
  history: AgentInputItem[];
}
