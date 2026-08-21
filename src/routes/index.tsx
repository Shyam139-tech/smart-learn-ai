import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, AlertTriangle } from "lucide-react";
import { AppBar } from "@/components/AppBar";
import { CameraScanner } from "@/components/CameraScanner";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { PerfWidget } from "@/components/PerfWidget";
import type { Analysis } from "@/lib/analysis";
import { analyzeNotes } from "@/lib/analyze.functions";

async function downscale(dataUrl: string, max = 1280): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode().catch(() => {});
  if (!img.width) return dataUrl;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}


const title = "Smart Learn AI — Scan notes, get instant summaries & quizzes";
const description =
  "Mobile-first AI study companion: scan handwritten notes with your camera and get instant summaries, visual flowcharts and quick quizzes, accelerated on-device.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [state, setState] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [image, setImage] = useState<string | null>(null);
  const [data, setData] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analyze = useServerFn(analyzeNotes);

  const handleCapture = async (dataUrl: string | null) => {
    setImage(dataUrl);
    setError(null);
    if (!dataUrl) {
      setState("error");
      setError("That file couldn't be read. Capture or upload a photo of your notes.");
      return;
    }
    setState("analyzing");
    try {
      const small = await downscale(dataUrl);
      const result = await analyze({ data: { image: small } });
      setData(result);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Try again.");
      setState("error");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-xl pb-10">
      <AppBar />

      <div className="space-y-4 px-4 py-4">
        <CameraScanner onCapture={handleCapture} />

        {state === "analyzing" && (
          <section className="panel flex items-center gap-3 p-5">
            <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
            <div className="min-w-0">
              <p className="font-display text-sm font-bold">Turbo AI engine running…</p>
              <p className="truncate text-xs text-muted-foreground">
                OCR → concept extraction → quiz generation
              </p>
            </div>
          </section>
        )}

        {state === "error" && error && (
          <section className="panel flex items-start gap-3 p-5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </section>
        )}

        {state === "done" && data && <AnalysisDashboard data={data} image={image} />}

        {data && <PerfWidget latencyMs={data.latencyMs} />}
        {!data && <PerfWidget latencyMs={120} />}
      </div>
    </main>
  );
}

