import { NextResponse } from 'next/server';
import { AnalyzeRequestSchema } from '@/lib/ai/schemas';
import { analyzeCode } from '@/lib/ai/analyze-code';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = AnalyzeRequestSchema.parse(body);

    // Validate code size
    if (validated.code.length > 50000) {
      return NextResponse.json({ error: 'Code too large (maximum 50,000 characters)' }, { status: 400 });
    }

    try {
      const result = await analyzeCode({
        task: validated.task,
        code: validated.code,
        language: validated.language,
        provider: validated.provider,
        apiKey: validated.apiKey,
      });

      return result.toTextStreamResponse();
    } catch (primaryError) {
      console.warn('Primary AI analysis attempt failed, attempting fallback:', primaryError);

      // If user did not strictly specify google, fallback to Groq
      if (validated.provider !== 'google') {
        try {
          const fallbackResult = await analyzeCode({
            task: validated.task,
            code: validated.code,
            language: validated.language,
            provider: 'groq',
          });
          return fallbackResult.toTextStreamResponse();
        } catch (fallbackError) {
          console.error('Fallback AI analysis also failed:', fallbackError);
        }
      }

      throw primaryError;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request aborted' }, { status: 499 });
      }
      return NextResponse.json({ error: 'Failed to analyze code: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
  }
}
