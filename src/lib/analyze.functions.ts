import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Analysis } from "./analysis";

const schema = z.object({ image: z.string().min(20) });

const SYSTEM = `You analyse a photo of study notes. Read all visible text, then respond with ONLY JSON matching:
{"topic":string,"summary":[{"title":string,"body":string}],"flow":[{"label":string,"detail":string}],"quiz":[{"question":string,"options":[string,string,string],"answer":number,"explain":string}]}
Rules: summary has exactly 3 items (body 1-2 sentences), flow has 4-6 short steps describing the process/structure in the notes, quiz has exactly 3 questions with 3 options each and answer is the 0-based index. Base everything strictly on what is actually written in the image. If the image is unreadable, set topic to "Unreadable notes" and explain that in the summary.`;

export const analyzeNotes = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }): Promise<Analysis> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured.");

    const started = Date.now();
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Lovable-API-Key": apiKey, "content-type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyse these notes." },
              { type: "image_url", image_url: { url: data.image } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Too many requests — try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content ?? "";
    const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed: Omit<Analysis, "latencyMs">;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Could not read the notes — try a clearer photo.");
    }

    return {
      topic: parsed.topic ?? "Your notes",
      summary: (parsed.summary ?? []).slice(0, 3),
      flow: (parsed.flow ?? []).slice(0, 6),
      quiz: (parsed.quiz ?? []).slice(0, 3).map((q) => ({
        ...q,
        options: q.options?.slice(0, 3) ?? [],
        answer: Math.max(0, Math.min(2, Number(q.answer) || 0)),
      })),
      latencyMs: Date.now() - started,
    };
  });
