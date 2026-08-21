import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Zap, ZapOff, X, ScanLine } from "lucide-react";

type Props = {
  onCapture: (dataUrl: string | null) => void;
};

export function CameraScanner({ onCapture }: Props) {
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        setError("Camera unavailable. Use Upload Image/PDF instead.");
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    const next = !flash;
    setFlash(next);
    try {
      await track?.applyConstraints({
        advanced: [{ torch: next } as MediaTrackConstraintSet],
      });
    } catch {
      /* torch unsupported */
    }
  };

  const capture = () => {
    const video = videoRef.current;
    let dataUrl: string | null = null;
    if (video && video.videoWidth) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    }
    setOpen(false);
    onCapture(dataUrl);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => onCapture(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      onCapture(null);
    }
    e.target.value = "";
  };

  return (
    <>
      <section className="panel neon-ring animate-rise p-5 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl gradient-neon">
          <ScanLine className="size-7 text-primary-foreground" strokeWidth={2.2} />
        </div>
        <h2 className="mt-3 font-display text-xl font-bold">Scan your notes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Point at a page — the Turbo AI engine summarises, diagrams and quizzes it instantly.
        </p>

        <button
          onClick={() => {
            setError(null);
            setOpen(true);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl gradient-neon px-5 py-4 font-display text-base font-bold text-primary-foreground transition-transform active:scale-[0.97]"
        >
          <Camera className="size-5" /> Scan Notes
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/50 px-5 py-3.5 text-sm font-semibold text-foreground transition-colors active:bg-secondary"
        >
          <Upload className="size-4" /> Upload Image / PDF
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={onFile}
        />
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close camera"
              className="grid size-10 place-items-center rounded-full bg-secondary/70"
            >
              <X className="size-5" />
            </button>
            <p className="truncate text-center text-xs text-muted-foreground">
              Align the page inside the frame
            </p>
            <button
              onClick={toggleFlash}
              aria-label="Toggle flash"
              className={`grid size-10 place-items-center rounded-full ${flash ? "gradient-neon text-primary-foreground" : "bg-secondary/70"}`}
            >
              {flash ? <Zap className="size-5" /> : <ZapOff className="size-5" />}
            </button>
          </div>

          <div className="relative mx-4 flex-1 overflow-hidden rounded-3xl border border-border bg-muted">
            <video
              ref={videoRef}
              playsInline
              muted
              className="size-full object-cover"
            />
            <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-dashed border-primary/70">
              <div className="absolute inset-x-0 top-0 h-px gradient-neon animate-scanline" />
            </div>
            {error && (
              <p className="absolute inset-x-4 bottom-4 rounded-xl bg-background/85 p-3 text-center text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="p-5">
            <button
              onClick={capture}
              className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-neon px-5 py-4 font-display text-base font-bold text-primary-foreground transition-transform active:scale-[0.97]"
            >
              <ScanLine className="size-5" /> Capture &amp; Analyze
            </button>
          </div>
        </div>
      )}
    </>
  );
}
