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

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {},
  retries = 3
): Promise<string> {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    throw new Error("Prompt is required.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  // Handle OpenRouter specifically since user provided an OpenRouter key
  const isOpenRouter = apiKey.startsWith("sk-or");
  const baseUrl = isOpenRouter 
    ? "https://openrouter.ai/api/v1/chat/completions"
    : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const openRouterModels = [
    "google/gemini-2.5-flash",
    "google/gemini-2.5-flash:free",
    "google/gemini-2.5-pro",
    "meta-llama/llama-3.3-70b-instruct:free",
  ];

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let responseText = "";

      if (isOpenRouter) {
        let lastError: unknown = null;
        for (const candidateModel of openRouterModels) {
          try {
            console.log(`[OpenRouter] Attempting generation with model: ${candidateModel}`);
            const messages = [];
            if (options.systemInstruction) {
              messages.push({ role: "system", content: options.systemInstruction });
            }
            messages.push({ role: "user", content: normalizedPrompt });

            const res = await fetch(baseUrl, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", 
                "X-Title": "COMET AGENT",
              },
              body: JSON.stringify({
                model: candidateModel,
                messages: messages,
                max_tokens: 1700,
              })
            });

            if (!res.ok) {
              const errData = await res.text();
              throw new Error(`OpenRouter API error: ${res.status} ${errData}`);
            }

            const data = (await res.json()) as {
              choices?: { message?: { content?: string } }[];
            };
            responseText = data.choices?.[0]?.message?.content || "";
            if (responseText) {
              break; // Successfully got response
            }
          } catch (error: unknown) {
            console.warn(`[OpenRouter] Model ${candidateModel} failed:`, error);
            lastError = error;
          }
        }

        if (!responseText) {
          throw lastError || new Error("All OpenRouter models failed to respond.");
        }
      } else {
        // Google GenAI Format
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
        responseText = response.text || "";
      }

      if (!responseText) {
        throw new Error("API returned an empty response.");
      }

      return responseText.trim();
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number };
      const isQuotaError = err?.message?.includes("429") || err?.status === 429 || err?.message?.includes("exceeded");
      
      if (isQuotaError && attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        await wait(delay);
        continue;
      }
      
      if (isQuotaError) {
        throw new Error("API quota exceeded. Please try again later or update your API key.");
      }
      
      throw error;
    }
  }
  
  throw new Error("Failed to generate content after multiple attempts.");
}
