import { useMemo, useState } from "react";
import { Search as SearchIcon, GitCommit, FileText, Code, GitPullRequest, Filter } from "lucide-react";
import { Card, CardBody, Badge } from "../components/ui";
import { PageShell } from "../components/Layout";
import { searchResults } from "../lib/data";
import type { SearchResult } from "../lib/types";

const typeIcon = {
  commit: GitCommit,
  pr: GitPullRequest,
  doc: FileText,
  code: Code,
};

const typeTone: Record<SearchResult["type"], "emerald" | "cyan" | "violet" | "amber"> = {
  commit: "emerald",
  pr: "cyan",
  doc: "violet",
  code: "amber",
};

export default function SearchPage() {
  const [q, setQ] = useState("redis payment");
  const [typeFilter, setTypeFilter] = useState<"all" | SearchResult["type"]>("all");

  const results = useMemo(
    () =>
      searchResults
        .filter((r) => (typeFilter === "all" ? true : r.type === typeFilter))
        .filter((r) =>
          q.trim() === ""
            ? true
            : (r.title + r.snippet + r.source + r.author).toLowerCase().includes(q.toLowerCase()),
        ),
    [q, typeFilter],
  );

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // knowledge search
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Search the knowledge base</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-400">
          Hybrid vector + BM25 search over commits, pull requests, documentation, and code. Re-ranked by
          Gemini. Embeddings refresh every 15 minutes.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-3 focus-within:border-neural-500/40">
            <SearchIcon className="h-5 w-5 shrink-0 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try: 'why redis', 'kyc state machine', 'idempotency'"
              className="flex-1 bg-transparent text-base text-ink-50 placeholder:text-ink-500 focus:outline-none"
            />
            <kbd className="hidden rounded border border-ink-700 bg-ink-800 px-2 py-0.5 font-mono text-[10px] text-ink-400 sm:inline">
              ⌘K
            </kbd>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-ink-400" />
            {(["all", "commit", "pr", "doc", "code"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={
                  typeFilter === t
                    ? "rounded-full bg-neural-500/15 px-3 py-1 text-xs font-medium text-neural-300 ring-1 ring-neural-500/30"
                    : "rounded-full border border-ink-800 bg-ink-900/40 px-3 py-1 text-xs text-ink-300 hover:border-ink-700"
                }
              >
                {t === "all" ? "All" : t.toUpperCase()}
              </button>
            ))}
            <div className="ml-auto text-[11px] text-ink-500">{results.length} results</div>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-3">
        {results.map((r) => {
          const Icon = typeIcon[r.type];
          return (
            <Card key={r.id} hover>
              <CardBody>
                <div className="flex items-start gap-4">
                  <div
                    className={
                      r.type === "commit"
                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neural-500/10 text-neural-300"
                        : r.type === "pr"
                          ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyber-500/10 text-cyber-300"
                          : r.type === "doc"
                            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300"
                            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300"
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-ink-50">{r.title}</h3>
                      <Badge tone={typeTone[r.type]}>{r.type}</Badge>
                      <span className="font-mono text-[10px] text-ink-500">{r.source}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{r.snippet}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-400">
                      <span>by <span className="text-ink-200">{r.author}</span></span>
                      <span>{r.date}</span>
                      <span className="ml-auto flex items-center gap-1 font-mono">
                        <span className="text-ink-500">relevance</span>
                        <span className="font-semibold text-neural-300">{(r.score * 100).toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-800">
                      <div
                        className="h-full bg-gradient-to-r from-neural-500 to-cyber-500"
                        style={{ width: `${r.score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
        {results.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center text-sm text-ink-500">
              No results match your query. Try different keywords or clear the type filter.
            </CardBody>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}
