import { AnalyzeRequestSchema } from "../ai/schemas";

export function validateAnalyzeRequest(data: unknown) {
  return AnalyzeRequestSchema.safeParse(data);
}
