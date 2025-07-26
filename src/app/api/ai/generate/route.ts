// src/app/api/ai/generate/route.ts
import { generateComponent } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Destructure both prompt and the optional image from the request body.
    const { prompt, image } = await req.json();

    if (!prompt && !image) {
      return NextResponse.json({ message: 'Prompt or image is required' }, { status: 400 });
    }

    // Call our AI library function, passing both the text prompt and the image data.
    const componentData = await generateComponent(prompt, image);

    return NextResponse.json(componentData, { status: 200 });
  } catch (error) {
    console.error('API_GENERATE_ERROR', error);
    return NextResponse.json(
      { message: 'Failed to generate component' },
      { status: 500 }
    );
  }
}
