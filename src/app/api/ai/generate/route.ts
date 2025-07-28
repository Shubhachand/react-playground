// src/app/api/ai/generate/route.ts
import { generateComponent } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, image }: { prompt?: string; image?: string } = await req.json();

    if (!prompt && !image) {
      return NextResponse.json({ message: 'Prompt or image is required' }, { status: 400 });
    }

    const componentData = await generateComponent(prompt || '', image || null);

    return NextResponse.json(componentData, { status: 200 });
  } catch (error: unknown) {
    console.error('API_GENERATE_ERROR', error);

    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message || 'Unknown error occurred'
        : 'Failed to generate component';

    return NextResponse.json({ message }, { status: 500 });
  }
}
