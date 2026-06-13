import { NextResponse } from "next/server";

import { runOrchestrator } from "@/lib/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt?: unknown };
    const prompt =
      typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const result = await runOrchestrator(prompt);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate the startup plan.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
