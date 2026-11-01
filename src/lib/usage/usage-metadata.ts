export interface UsageMetadata {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export function calculateCost(model: string, usage: UsageMetadata): number {
  // Simple estimation based on model type
  const isSonnet = model.includes("sonnet");
  const inputRate = isSonnet ? 3.0 / 1_000_000 : 2.5 / 1_000_000;
  const outputRate = isSonnet ? 15.0 / 1_000_000 : 10.0 / 1_000_000;

  return usage.promptTokens * inputRate + usage.completionTokens * outputRate;
}
