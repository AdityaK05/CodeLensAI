export const ModelRegistry = {
  "qwen-3.5-397b-a17b": {
    provider: "google",
    id: "gemini-1.5-pro",
    capabilities: ["code", "analysis", "reasoning"],
    rateLimit: 50
  },
  "qwen-3.5-plus": {
    provider: "google",
    id: "gemini-1.5-flash",
    capabilities: ["code", "analysis", "reasoning"],
    rateLimit: 50
  },
  "qwen-3.5-flash": {
    provider: "google",
    id: "gemini-1.5-flash",
    capabilities: ["code", "analysis"],
    rateLimit: 50
  }
} as const;

export type ProviderType = "google";

export type ModelConfig = {
  provider: ProviderType;
  id: string;
  capabilities: string[];
  rateLimit: number;
};

export type ModelKey = keyof typeof ModelRegistry;

export const GroqModelRegistry = {
  "qwen-3.5-397b-a17b": {
    provider: "groq",
    id: "qwen-3.5-397b-a17b",
    capabilities: ["code", "analysis", "reasoning"],
    rateLimit: 50
  },
  "qwen-3.5-plus": {
    provider: "groq",
    id: "qwen-3.5-plus",
    capabilities: ["code", "analysis", "reasoning"],
    rateLimit: 50
  },
  "qwen-3.5-flash": {
    provider: "groq",
    id: "qwen-3.5-flash",
    capabilities: ["code", "analysis"],
    rateLimit: 50
  }
} as const;

export type GroqModelKey = keyof typeof GroqModelRegistry;

export function getModelForTask(task: string): ModelKey {
  // Routing logic - Groq only
  switch (task) {
    case "complexity":
      return "qwen-3.5-397b-a17b";
    case "debug":
      return "qwen-3.5-397b-a17b";
    case "improve":
      return "qwen-3.5-plus";
    case "learn":
      return "qwen-3.5-flash";
    default:
      return "qwen-3.5-plus";
  }
}
