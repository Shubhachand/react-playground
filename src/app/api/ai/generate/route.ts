// src/app/api/ai/generate/route.ts
import { generateComponent } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

// FIX: Increase the maximum body size limit for this specific API route.
// This is necessary to handle the large data from image uploads.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set a new limit (e.g., 4MB)
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, image } = await req.json();

    if (!prompt && !image) {
      return NextResponse.json({ message: 'Prompt or image is required' }, { status: 400 });
    }

    const componentData = await generateComponent(prompt, image);

    return NextResponse.json(componentData, { status: 200 });
  } catch (error: any) {
    console.error('API_GENERATE_ERROR', error);
    return NextResponse.json(
      { message: error.message || 'Failed to generate component' },
      { status: 500 }
    );
  }
}
