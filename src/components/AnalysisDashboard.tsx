import { useState } from "react";
import { ArrowDown, Brain, CheckCircle2, GitBranch, ListChecks, XCircle } from "lucide-react";
import type { Analysis } from "@/lib/analysis";

const tabs = [
  { id: "summary", label: "Summary", icon: Brain },
  { id: "visual", label: "Visual", icon: GitBranch },
  { id: "quiz", label: "Quiz", icon: ListChecks },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AnalysisDashboard({ data, image }: { data: Analysis; image: string | null }) {
  const [tab, setTab] = useState<TabId>("summary");

  return (
    <section className="panel animate-rise overflow-hidden">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border p-4">
        <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          {image ? (
            <img src={image} alt="Scanned notes preview" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center">
              <Brain className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Analysis complete
          </p>
          <h2 className="truncate font-display text-base font-bold">{data.topic}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 p-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors ${
              tab === t.id
                ? "gradient-neon text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            <t.icon className="size-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 pt-2">
        {tab === "summary" && <Summary data={data} />}
        {tab === "visual" && <Flow data={data} />}
        {tab === "quiz" && <Quiz data={data} />}
      </div>
    </section>
  );
}

function Summary({ data }: { data: Analysis }) {
  return (
    <ul className="space-y-2.5">
      {data.summary.map((s, i) => (
        <li
          key={s.title}
          className="animate-rise rounded-2xl border border-border bg-background/40 p-3.5"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-lg gradient-neon font-display text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="truncate font-display text-sm font-bold">{s.title}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Flow({ data }: { data: Analysis }) {
  return (
    <div className="space-y-1">
      {data.flow.map((node, i) => (
        <div key={node.label} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="rounded-2xl border border-accent/40 bg-background/40 p-3">
            <p className="font-display text-sm font-bold text-accent">{node.label}</p>
            <p className="text-xs text-muted-foreground">{node.detail}</p>
          </div>
          {i < data.flow.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className="size-4 text-primary" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Quiz({ data }: { data: Analysis }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const score = data.quiz.reduce(
    (acc, q, i) => acc + (picked[i] === q.answer ? 1 : 0),
    0,
  );
  const done = Object.keys(picked).length === data.quiz.length;

  return (
    <div className="space-y-3">
      {data.quiz.map((q, qi) => {
        const chosen = picked[qi];
        return (
          <div key={q.question} className="rounded-2xl border border-border bg-background/40 p-3.5">
            <p className="text-sm font-semibold">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-2.5 space-y-1.5">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isRight = oi === q.answer;
                const state =
                  chosen === undefined
                    ? "bg-secondary/50 text-foreground"
                    : isRight
                      ? "border border-primary/60 bg-primary/15 text-foreground"
                      : isChosen
                        ? "border border-destructive/60 bg-destructive/15 text-foreground"
                        : "bg-secondary/30 text-muted-foreground";
                return (
                  <button
                    key={opt}
                    disabled={chosen !== undefined}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${state}`}
                  >
                    <span className="min-w-0">{opt}</span>
                    {chosen !== undefined && isRight && (
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    )}
                    {chosen !== undefined && isChosen && !isRight && (
                      <XCircle className="size-4 shrink-0 text-destructive" />
                    )}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined && (
              <p className="mt-2 text-xs text-muted-foreground">{q.explain}</p>
            )}
          </div>
        );
      })}

      {done && (
        <p className="rounded-2xl gradient-neon p-3 text-center font-display text-sm font-bold text-primary-foreground">
          Score {score}/{data.quiz.length} — comprehension checked in seconds
        </p>
      )}
    </div>
  );
}
