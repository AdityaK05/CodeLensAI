import { streamText } from 'ai';
import { aiProvider } from './provider';
import { getPrompt } from './prompts';
import { AnalysisTask } from './schemas';

export interface AnalyzeOptions {
  task: AnalysisTask;
  code: string;
  language?: string;
  provider?: 'auto' | 'google' | 'groq';
  apiKey?: string;
}

export async function isGeminiKeyValid(key?: string): Promise<boolean> {
  const actualKey =
    key ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!actualKey) return false;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${actualKey}`,
      {
        signal: AbortSignal.timeout(2500),
      }
    );
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function analyzeCode(options: AnalyzeOptions) {
  const { task, code, language = 'typescript', provider = 'auto', apiKey } = options;
  const prompt = getPrompt(task, code, language);

  // If user explicitly chose Google Gemini
  if (provider === 'google') {
    const geminiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const isValid = await isGeminiKeyValid(geminiKey);
    if (!isValid) {
      throw new Error(
        'Google Gemini API key in .env.local or settings is invalid or expired. Please check your key or switch provider to Groq / Auto in Settings.'
      );
    }
    const model = aiProvider.google('gemini-1.5-flash', geminiKey);
    return streamText({
      model: model as any,
      prompt,
    });
  }

  // If user explicitly chose Groq
  if (provider === 'groq') {
    const model = aiProvider.groq('qwen/qwen3.8-27b', apiKey);
    return streamText({
      model: model as any,
      prompt,
    });
  }

  // Auto Mode: check if Gemini key is valid. If yes, use Gemini; otherwise seamlessly use Groq.
  const geminiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const geminiValid = await isGeminiKeyValid(geminiKey);

  if (geminiValid) {
    const model = aiProvider.google('gemini-1.5-flash', geminiKey);
    return streamText({
      model: model as any,
      prompt,
    });
  }

  // Fallback to Groq ultra-fast provider
  const groqModel = aiProvider.groq('qwen/qwen3.8-27b');
  return streamText({
    model: groqModel as any,
    prompt,
  });
}
