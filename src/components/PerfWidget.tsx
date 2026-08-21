import { Gauge, Zap, Battery, MonitorSmartphone } from "lucide-react";

const stats = [
  { icon: Zap, label: "On-device inference", value: "120 ms" },
  { icon: MonitorSmartphone, label: "Render rate", value: "144 Hz" },
  { icon: Battery, label: "Battery cost", value: "0.4 %" },
];

export function PerfWidget({ latencyMs = 120 }: { latencyMs?: number }) {
  return (
    <section className="panel animate-rise p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Gauge className="size-4 shrink-0 text-primary" />
          <h2 className="truncate font-display text-sm font-bold">Turbo Performance</h2>
        </div>
        <span className="shrink-0 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-semibold text-primary">
          iQOO Hackathon
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Processed in{" "}
        <span className="font-display font-bold text-foreground">{latencyMs}ms</span> via On-Device
        AI Acceleration
      </p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-[88%] rounded-full gradient-neon" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-background/40 p-2.5">
            <s.icon className="size-3.5 text-accent" />
            <p className="mt-1.5 font-display text-sm font-bold">{s.value}</p>
            <p className="text-[10px] leading-tight text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
