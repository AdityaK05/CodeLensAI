import { z } from "zod";

export const AnalysisTaskSchema = z.enum([
  "explain",
  "debug",
  "complexity",
  "improve",
  "learn"
]);

export type AnalysisTask = z.infer<typeof AnalysisTaskSchema>;

export const AnalyzeRequestSchema = z.object({
  code: z.string().min(1, "Code cannot be empty").max(50000, "Code exceeds 50,000 characters"),
  task: AnalysisTaskSchema,
  language: z.string().default("typescript"),
  provider: z.enum(["auto", "google", "groq"]).optional().default("auto"),
  apiKey: z.string().optional(),
  context: z.string().optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const AnalysisResponseSchema = z.object({
  summary: z.string(),
  details: z.array(z.string()),
  complexity: z.string().optional(),
  suggestions: z.array(z.string()).optional(),
});
