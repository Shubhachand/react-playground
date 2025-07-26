// src/lib/ai.ts
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generationPrompt = `
You are an expert React and Tailwind CSS developer.
A user will provide a prompt, and optionally an image, to create or modify a React component.
You must return a single, valid JSON object containing two keys: "jsx" and "css".

- The "jsx" key must contain the string of the React component code.
- The "css" key must contain any additional CSS needed, which can be empty.
- The component must be self-contained in a single function with a default export.
- All styling must be done using Tailwind CSS classes. Do not use style objects or regular CSS unless absolutely necessary.
- If an image is provided, analyze it and generate a component that visually matches the design in the image.
- Do not include any explanation, preamble, or any text outside of the JSON object.

Example user prompt: "create a simple hello world button"
Example AI response:
{
  "jsx": "export default function HelloWorldButton() {\\n  return (\\n    <button className=\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\\">\\n      Hello World\\n    </button>\\n  );\\n}",
  "css": ""
}
`;

export async function generateComponent(prompt: string, imageBase64: string | null = null) {
  const modelName = imageBase64 ? 'gemini-pro-vision' : 'gemini-1.5-flash-latest';
  const model = genAI.getGenerativeModel({ model: modelName });

  const promptParts: Part[] = [
    { text: generationPrompt },
    { text: `User prompt: "${prompt || 'Analyze the provided image.'}"` },
  ];

  if (imageBase64) {
    // FIX: Make image processing more robust by dynamically extracting the mime type.
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid image data format. Expected a data URL.');
    }
    const mimeType = match[1];
    const data = match[2];

    const imagePart = {
      inlineData: {
        mimeType,
        data,
      },
    };
    promptParts.push(imagePart);
  }

  try {
    const result = await model.generateContent({ contents: [{ role: 'user', parts: promptParts }] });
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedText);

    return jsonResponse as { jsx: string; css: string };
  } catch (error: any) {
    console.error('AI_GENERATION_ERROR:', error);
    // Re-throw the error so the API route can catch it and send a specific message.
    throw new Error(error.message || 'Failed to generate component from AI.');
  }
}
