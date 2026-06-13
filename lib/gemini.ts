import { GoogleGenAI } from "@google/genai";

const model = "gemini-2.5-flash";

type GenerateTextOptions = {
  systemInstruction?: string;
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {}
): Promise<string> {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    throw new Error("Prompt is required.");
  }

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model,
    contents: normalizedPrompt,
    ...(options.systemInstruction
      ? {
          config: {
            systemInstruction: options.systemInstruction,
          },
        }
      : {}),
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}
