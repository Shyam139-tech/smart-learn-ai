import { Cpu, Sparkles } from "lucide-react";

export function AppBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl gradient-neon">
            <Sparkles className="size-5 text-primary-foreground" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold leading-tight">
              Smart<span className="neon-text"> Learn AI</span>
            </h1>
            <p className="truncate text-[11px] text-muted-foreground">Scan. Understand. Remember.</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-primary/40 bg-secondary/60 px-3 py-1.5">
          <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
          <Cpu className="size-3.5 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            iQOO Turbo AI
          </span>
        </div>
      </div>
    </header>
  );
}
