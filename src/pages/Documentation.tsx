import { FileText, RefreshCw, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardBody, Button, Progress } from "../components/ui";
import { PageShell } from "../components/Layout";
import { docs } from "../lib/data";

export default function Documentation() {
  const avg = Math.round(docs.reduce((s, d) => s + d.coverage, 0) / docs.length);

  return (
    <PageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
            // automatic documentation
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Auto-generated documentation</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-400">
            Gemini writes and refreshes module-level documentation from commit history and code.
            Coverage drops automatically when the code drifts from the last generated snapshot.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-ink-800 bg-ink-900/40 px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-ink-500">Avg coverage</div>
            <div className="text-lg font-semibold tabular-nums text-ink-50">{avg}%</div>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4" /> Regenerate all
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {docs.map((d) => {
          const good = d.coverage >= 80;
          const medium = d.coverage >= 60 && d.coverage < 80;
          return (
            <Card key={d.id} hover>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={
                        good
                          ? "flex h-9 w-9 items-center justify-center rounded-lg bg-neural-500/10 text-neural-300"
                          : medium
                            ? "flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300"
                            : "flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300"
                      }
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight text-ink-50">{d.title}</h3>
                      <div className="mt-0.5 font-mono text-[10px] text-ink-500">{d.module}</div>
                    </div>
                  </div>
                  {good ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-neural-300" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-ink-400">{d.summary}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-400">Coverage</span>
                    <span className="tabular-nums text-ink-200">{d.coverage}%</span>
                  </div>
                  <Progress value={d.coverage} tone={good ? "emerald" : medium ? "amber" : "rose"} className="mt-1.5" />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink-800/60 pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-ink-500">
                    <Sparkles className="h-3 w-3 text-neural-300" />
                    Generated {d.generatedAt}
                  </div>
                  <button className="text-[11px] font-medium text-neural-300 hover:text-neural-200">
                    Regenerate →
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader
          title="How docs are generated"
          description="A 5-stage pipeline from commit to readable spec"
        />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { n: "01", t: "Ingest", d: "GitHub webhooks push commits & PRs to the ingestion queue." },
              { n: "02", t: "Chunk", d: "Code + commit messages are split into semantic chunks (512 tokens)." },
              { n: "03", t: "Embed", d: "Gemini text-embedding-004 produces 768-dim vectors → ChromaDB." },
              { n: "04", t: "Synthesize", d: "Gemini Pro writes module-level docs with citations and examples." },
              { n: "05", t: "Diff", d: "On next commit, diff coverage and flag stale sections for regeneration." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
                <div className="font-mono text-[10px] text-neural-400">{s.n}</div>
                <div className="mt-1 text-sm font-semibold text-ink-50">{s.t}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-ink-400">{s.d}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </PageShell>
  );
}
