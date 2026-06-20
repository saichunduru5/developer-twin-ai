import { useMemo, useState } from "react";
import { GitBranch, Star, Users, GitCommit, Clock, Filter, ArrowUpDown } from "lucide-react";
import { Card, CardHeader, Badge, Progress } from "../components/ui";
import { InlineSparkline } from "../components/charts";
import { PageShell } from "../components/Layout";
import { repositories } from "../lib/data";
import type { Repository } from "../lib/types";

const riskTone = (r: Repository["risk"]) =>
  r === "CRITICAL" ? ("rose" as const) : r === "HIGH" ? ("amber" as const) : r === "MEDIUM" ? ("cyan" as const) : ("emerald" as const);

const languageColor: Record<string, string> = {
  Java: "#f97316",
  TypeScript: "#3b82f6",
  Python: "#22c55e",
  Go: "#06b6d4",
};

type SortKey = "name" | "knowledgeScore" | "risk" | "commitsLast90" | "busFactor";

export default function Repositories() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("risk");
  const [selected, setSelected] = useState<string | null>(repositories[2].id);

  const languages = useMemo(
    () => ["all", ...Array.from(new Set(repositories.map((r) => r.language)))],
    [],
  );

  const riskRank: Record<Repository["risk"], number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = repositories.filter(
      (r) =>
        (lang === "all" || r.language === lang) &&
        (q === "" || r.name.toLowerCase().includes(q) || r.org.toLowerCase().includes(q)),
    );
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "knowledgeScore":
          return b.knowledgeScore - a.knowledgeScore;
        case "risk":
          return riskRank[b.risk] - riskRank[a.risk];
        case "commitsLast90":
          return b.commitsLast90 - a.commitsLast90;
        case "busFactor":
          return a.busFactor - b.busFactor;
        default:
          return 0;
      }
    });
    return list;
  }, [query, lang, sort]);

  const active = repositories.find((r) => r.id === selected) ?? filtered[0];

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // repositories
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Connected repositories</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          {repositories.length} repos across {new Set(repositories.map((r) => r.org)).size} organizations. Commit context is ingested into ChromaDB every 15 minutes.
        </p>
      </div>

      <Card>
        <CardHeader
          title="All repositories"
          description="Filter, sort, and inspect knowledge per repository"
          action={
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/60 px-3 py-1.5 text-xs text-ink-300 md:flex">
                <Filter className="h-3.5 w-3.5" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or org"
                  className="w-48 bg-transparent text-ink-100 placeholder:text-ink-500 focus:outline-none"
                />
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-8 rounded-lg border border-ink-800 bg-ink-900/60 px-2 text-xs text-ink-200 focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l === "all" ? "All languages" : l}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-8 rounded-lg border border-ink-800 bg-ink-900/60 px-2 text-xs text-ink-200 focus:outline-none"
              >
                <option value="risk">Sort: Risk</option>
                <option value="knowledgeScore">Sort: Knowledge</option>
                <option value="commitsLast90">Sort: Commits</option>
                <option value="busFactor">Sort: Bus factor</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          }
        />
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          {/* List */}
          <div className="divide-y divide-ink-800/60">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-ink-900/40 ${
                  selected === r.id ? "bg-ink-900/60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: languageColor[r.language] ?? "#8891a3" }}
                    />
                    <span className="font-mono text-[11px] text-ink-500">{r.org}/</span>
                    <span className="truncate text-sm font-semibold text-ink-50">{r.name}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-400">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {r.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitCommit className="h-3 w-3" />
                      {r.commitsLast90}/90d
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {r.contributors}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {r.lastCommit}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <InlineSparkline value={r.knowledgeScore} tone={r.risk === "LOW" ? "emerald" : r.risk === "MEDIUM" ? "cyan" : r.risk === "HIGH" ? "amber" : "rose"} />
                  <Badge tone={riskTone(r.risk)}>{r.risk}</Badge>
                </div>
              </button>
            ))}
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-ink-500">No repositories match your filters.</div>
            ) : null}
          </div>

          {/* Detail panel */}
          <div className="border-t border-ink-800/60 lg:border-l lg:border-t-0">
            {active ? <RepoDetail repo={active} /> : null}
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

function RepoDetail({ repo }: { repo: Repository }) {
  const contributors = Array.from({ length: Math.min(repo.contributors, 6) }, (_, i) => {
    const initials = ["CS", "AR", "RV", "PN", "AM", "KS"][i] ?? "XX";
    return initials;
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-ink-400" />
        <span className="font-mono text-[11px] text-ink-500">{repo.org}/</span>
        <span className="text-base font-semibold text-ink-50">{repo.name}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: languageColor[repo.language] ?? "#8891a3" }}
        />
        <span className="text-xs text-ink-300">{repo.language}</span>
        <Badge tone={riskTone(repo.risk)}>{repo.risk}</Badge>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-400">Knowledge score</span>
            <span className="tabular-nums text-ink-100">{repo.knowledgeScore}/100</span>
          </div>
          <Progress value={repo.knowledgeScore} className="mt-1.5" tone={repo.knowledgeScore > 75 ? "emerald" : repo.knowledgeScore > 50 ? "cyan" : "amber"} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="Bus factor" value={repo.busFactor} hint={repo.busFactor === 1 ? "critical" : "healthy"} />
          <Metric label="Contributors" value={repo.contributors} />
          <Metric label="Commits (90d)" value={repo.commitsLast90} />
          <Metric label="Last commit" value={repo.lastCommit} />
        </div>

        <div>
          <div className="text-xs text-ink-400">Top contributors</div>
          <div className="mt-2 flex -space-x-2">
            {contributors.map((c, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ink-700 to-ink-800 text-[10px] font-semibold text-ink-100 ring-2 ring-ink-950"
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
          <div className="flex items-center gap-2 text-xs text-ink-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-neural-300" />
            Recent commit context (vectorized)
          </div>
          <div className="mt-3 space-y-2.5 font-mono text-[11px]">
            {[
              { hash: "8f2c1a4", msg: "feat(cache): add Redis idempotency store", who: "priya.nair", when: "2d" },
              { hash: "31b9fe0", msg: "ops: deploy Sentinel with quorum writes", who: "ananya.rao", when: "3d" },
              { hash: "a12ff02", msg: "fix: fallback to pg on cache miss", who: "priya.nair", when: "5d" },
              { hash: "b9801c4", msg: "test: idempotency race-condition harness", who: "rahul.verma", when: "6d" },
            ].map((c) => (
              <div key={c.hash} className="flex items-start gap-2 rounded-md bg-ink-950/60 p-2">
                <span className="text-neural-300">{c.hash}</span>
                <span className="flex-1 truncate text-ink-200">{c.msg}</span>
                <span className="shrink-0 text-ink-500">{c.who}</span>
                <span className="shrink-0 text-ink-600">{c.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-3">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-lg font-semibold tabular-nums text-ink-50">{value}</div>
        {hint ? <span className="text-[10px] text-ink-400">{hint}</span> : null}
      </div>
    </div>
  );
}
