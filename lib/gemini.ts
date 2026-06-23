import { GoogleGenAI } from "@google/genai";

// Models to try in order — from best to most-available
const googleModels = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

type GenerateTextOptions = {
  systemInstruction?: string;
};


async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {},
  retries = 5
): Promise<string> {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    throw new Error("Prompt is required.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  // Handle OpenRouter specifically
  const isOpenRouter = apiKey.startsWith("sk-or");

  if (isOpenRouter) {
    return generateViaOpenRouter(apiKey, normalizedPrompt, options, retries);
  } else {
    return generateViaGoogleAI(apiKey, normalizedPrompt, options, retries);
  }
}

// --------------- Google GenAI path with multi-model fallback ---------------
async function generateViaGoogleAI(
  apiKey: string,
  prompt: string,
  options: GenerateTextOptions,
  retries: number
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown = null;

  for (const candidateModel of googleModels) {
    console.log(`[GoogleAI] Trying model: ${candidateModel}`);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents: prompt,
          ...(options.systemInstruction
            ? {
                config: {
                  systemInstruction: options.systemInstruction,
                },
              }
            : {}),
        });

        const responseText = response.text || "";
        if (!responseText) {
          throw new Error("API returned an empty response.");
        }

        console.log(`[GoogleAI] Success with model: ${candidateModel}`);
        return responseText.trim();
      } catch (error: unknown) {
        lastError = error;
        const err = error as { message?: string; status?: number };
        const msg = err?.message || "";
        const isRetryable =
          msg.includes("503") ||
          msg.includes("429") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("exceeded") ||
          msg.includes("overloaded") ||
          err?.status === 503 ||
          err?.status === 429;

        if (isRetryable && attempt < retries) {
          // exponential backoff: 3s, 6s, 12s, 24s …
          const delay = Math.pow(2, attempt) * 1500;
          console.warn(
            `[GoogleAI] ${candidateModel} attempt ${attempt}/${retries} failed (${msg.slice(0, 80)}). Retrying in ${delay}ms…`
          );
          await wait(delay);
          continue;
        }

        // If not retryable or out of retries, break to next model
        console.warn(
          `[GoogleAI] ${candidateModel} failed after ${attempt} attempt(s): ${msg.slice(0, 120)}`
        );
        break;
      }
    }
  }

  // All models exhausted
  const errMsg =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `All Google AI models failed. Last error: ${errMsg}`
  );
}

// --------------- OpenRouter path with multi-model fallback ---------------
async function generateViaOpenRouter(
  apiKey: string,
  prompt: string,
  options: GenerateTextOptions,
  retries: number
): Promise<string> {
  const baseUrl = "https://openrouter.ai/api/v1/chat/completions";
  const openRouterModels = [
    "openrouter/free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.5-flash-lite",
    "google/gemini-2.5-flash",
  ];

  let lastError: unknown = null;

  for (const candidateModel of openRouterModels) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(
          `[OpenRouter] Attempting model: ${candidateModel} (attempt ${attempt}/${retries})`
        );
        const messages = [];
        if (options.systemInstruction) {
          messages.push({ role: "system", content: options.systemInstruction });
        }
        messages.push({ role: "user", content: prompt });

        const res = await fetch(baseUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "COMET AGENT",
          },
          body: JSON.stringify({
            model: candidateModel,
            messages: messages,
            max_tokens: 1700,
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          throw new Error(
            `OpenRouter API error: ${res.status} ${errData}`
          );
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const responseText = data.choices?.[0]?.message?.content || "";
        if (responseText) {
          console.log(`[OpenRouter] Success with model: ${candidateModel}`);
          return responseText.trim();
        }
      } catch (error: unknown) {
        lastError = error;
        const err = error as { message?: string };
        const msg = err?.message || "";
        const isRetryable =
          msg.includes("503") ||
          msg.includes("429") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand");

        if (isRetryable && attempt < retries) {
          const delay = Math.pow(2, attempt) * 1500;
          console.warn(
            `[OpenRouter] ${candidateModel} attempt ${attempt} failed. Retrying in ${delay}ms…`
          );
          await wait(delay);
          continue;
        }

        console.warn(`[OpenRouter] Model ${candidateModel} failed:`, msg);
        break;
      }
    }
  }

  const errMsg =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`All OpenRouter models failed. Last error: ${errMsg}`);
}
