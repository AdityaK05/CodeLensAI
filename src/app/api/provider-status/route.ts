import { NextResponse } from 'next/server';
import { isGeminiKeyValid } from '@/lib/ai/analyze-code';

export async function GET() {
  const geminiValid = await isGeminiKeyValid();
  const hasGroq = Boolean(process.env.GROQ_API_KEY);

  return NextResponse.json({
    status: geminiValid || hasGroq ? "ready" : "offline",
    ready: geminiValid || hasGroq,
  });
}
