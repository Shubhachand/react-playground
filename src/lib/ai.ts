// src/lib/ai.ts
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const basePrompt = `
You are an expert React and Tailwind CSS developer.
You must return a single, valid JSON object and nothing else.
The JSON object must contain two keys: "jsx" and "css".

**CRITICAL RULES:**
1.  The "jsx" value must be a string containing a complete, self-contained React component.
2.  The component MUST start with 'export default function...'
3.  The JSX code inside the return statement MUST be well-formed. It must have a single root element.
4.  All styling must be done using Tailwind CSS classes inside the \`className\` attribute.
5.  Do not include any explanation, preamble, or any text outside of the JSON object.

**COMMON MISTAKES TO AVOID:**
- DO NOT output incomplete code snippets.
- DO NOT have syntax errors like missing closing tags.
- DO NOT forget the 'export default function...' part.

---
`;

const textGenerationPrompt = `${basePrompt}\nA user will provide a prompt to create or modify a React component.`;

const imageGenerationPrompt = `${basePrompt}\nAnalyze the provided image and generate a React component that visually matches its design.`;

export async function generateComponent(prompt: string, imageBase64: string | null = null) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const promptParts: Part[] = [];

  if (imageBase64) {
    promptParts.push({ text: imageGenerationPrompt });
    if (prompt) {
        promptParts.push({ text: `Additional user instructions: "${prompt}"` });
    }
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid image data format. Expected a data URL.');
    }
    const mimeType = match[1];
    const data = match[2];
    promptParts.push({ inlineData: { mimeType, data } });
  } else {
    promptParts.push({ text: textGenerationPrompt });
    promptParts.push({ text: `User prompt: "${prompt}"` });
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
    throw new Error(error.message || 'Failed to generate component from AI.');
  }
}
