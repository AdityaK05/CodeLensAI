import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export function getGoogleClient(customApiKey?: string) {
  const apiKey =
    customApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env.local or settings');
  }

  return createGoogleGenerativeAI({
    apiKey,
  });
}

export function getGroqClient(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in .env.local or settings');
  }

  return createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey,
  });
}

export const aiProvider = {
  google: (modelId: string = 'gemini-1.5-flash', customKey?: string) => {
    const client = getGoogleClient(customKey);
    return client(modelId);
  },
  groq: (modelId: string = 'qwen/qwen3.8-27b', customKey?: string) => {
    const client = getGroqClient(customKey);
    return client(modelId);
  },
};
