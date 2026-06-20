import {
  Activity,
  GitCommit,
  GitPullRequest,
  Shield,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Stat, Badge, Progress } from "../components/ui";
import { Bars, Ring, Sparkline, Heatmap, InlineSparkline } from "../components/charts";
import { PageShell } from "../components/Layout";
import {
  activitySeries,
  aiInsights,
  knowledgeHealth,
  repositories,
  team,
} from "../lib/data";

const severityTone = {
  CRITICAL: "rose" as const,
  HIGH: "amber" as const,
  MEDIUM: "cyan" as const,
  LOW: "emerald" as const,
};

export default function Dashboard() {
  const criticalRepos = repositories.filter((r) => r.risk === "CRITICAL" || r.risk === "HIGH");

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-ink-800/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
            // dashboard
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">
            Welcome back, Chunduru Sai
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Here is what your engineering org knows — and what it is about to forget.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="emerald">
            <Activity className="h-3 w-3" /> live ingestion
          </Badge>
          <Badge tone="cyan">Gemini online</Badge>
          <Badge tone="slate">acme-fintech</Badge>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="flex items-start justify-between">
            <Stat label="Commits (90d)" value="1,286" delta="+12.4%" deltaTone="up" />
            <div className="rounded-lg bg-neural-500/10 p-2 text-neural-300">
              <GitCommit className="h-4 w-4" />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <Stat label="PRs reviewed" value="812" delta="+6.1%" deltaTone="up" />
            <div className="rounded-lg bg-cyber-500/10 p-2 text-cyber-300">
              <GitPullRequest className="h-4 w-4" />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <Stat label="Knowledge Health" value="74" delta="+3" deltaTone="up" hint="out of 100" />
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-300">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <Stat
              label="Risk score"
              value="38"
              delta="-20"
              deltaTone="down"
              hint="lower is better"
            />
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-300">
              <Shield className="h-4 w-4" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Middle row: Health ring + Activity bars */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader
            title="Knowledge Health Score"
            description="Weighted composite: documentation, bus factor, freshness, coverage"
            action={<Badge tone="emerald">+3 this week</Badge>}
          />
          <CardBody className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Ring value={knowledgeHealth.overall} size={180} stroke={14} label="Overall" tone="emerald" />
            <div className="w-full space-y-4 sm:w-64">
              {[
                { label: "Documentation", v: knowledgeHealth.documented, tone: "cyan" as const },
                { label: "Bus factor", v: knowledgeHealth.busFactor, tone: "amber" as const },
                { label: "Freshness", v: knowledgeHealth.freshness, tone: "emerald" as const },
                { label: "Coverage", v: knowledgeHealth.coverage, tone: "emerald" as const },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-300">{row.label}</span>
                    <span className="tabular-nums text-ink-200">{row.v}</span>
                  </div>
                  <Progress value={row.v} tone={row.tone} className="mt-1.5" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Weekly engineering activity"
            description="Commits, reviews, and incidents across all connected repos"
            action={
              <div className="flex items-center gap-3 text-xs">
                <LegendDot color="#34d399" label="Commits" />
                <LegendDot color="#22d3ee" label="Reviews" />
                <LegendDot color="#fb7185" label="Incidents" />
              </div>
            }
          />
          <CardBody>
            <Bars data={activitySeries.map((d) => ({ label: d.day, commits: d.commits, reviews: d.reviews, incidents: d.incidents }))} />
          </CardBody>
        </Card>
      </div>

      {/* AI insights + risky repos */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader
            title="AI insights"
            description="Gemini-ranked observations across your org"
            action={
              <Link
                to="/app/analytics"
                className="inline-flex items-center gap-1 text-xs font-medium text-neural-300 hover:text-neural-200"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody className="space-y-3">
            {aiInsights.map((i) => (
              <div
                key={i.id}
                className="group flex items-start gap-3 rounded-xl border border-ink-800 bg-ink-900/40 p-4 transition hover:border-ink-700"
              >
                <div className="mt-1 shrink-0">
                  {i.severity === "CRITICAL" ? (
                    <AlertTriangle className="h-4 w-4 text-rose-300" />
                  ) : i.severity === "HIGH" ? (
                    <TrendingUp className="h-4 w-4 text-amber-300" />
                  ) : i.severity === "MEDIUM" ? (
                    <Activity className="h-4 w-4 text-cyber-300" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-neural-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={severityTone[i.severity]}>{i.severity}</Badge>
                    <span className="font-mono text-[10px] text-ink-500">{i.module}</span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-semibold text-ink-50">{i.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{i.body}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Repos requiring attention"
            description="Bus-factor ≤ 2 or risk ≥ HIGH"
            action={
              <Link
                to="/app/repositories"
                className="inline-flex items-center gap-1 text-xs font-medium text-neural-300 hover:text-neural-200"
              >
                All repos <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody className="space-y-3">
            {criticalRepos.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink-800 bg-ink-900/40 p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-500">{r.org}/</span>
                    <span className="truncate text-sm font-semibold text-ink-50">{r.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-ink-400">
                    <span>{r.language}</span>
                    <span>bus {r.busFactor}</span>
                    <span>last: {r.lastCommit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <InlineSparkline value={r.knowledgeScore} tone={r.risk === "CRITICAL" ? "rose" : "amber"} />
                  <Badge tone={r.risk === "CRITICAL" ? "rose" : r.risk === "HIGH" ? "amber" : "cyan"}>
                    {r.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Bottom: contribution heatmap + team */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader
            title="Contribution heatmap"
            description="Last 24 weeks across all connected repos"
            action={<Badge tone="emerald">active</Badge>}
          />
          <CardBody>
            <Heatmap weeks={26} seed={17} />
            <div className="mt-4 flex items-center justify-between text-[11px] text-ink-500">
              <span>Less</span>
              <div className="flex items-center gap-1">
                {["#0f1320", "#065f46", "#059669", "#10b981", "#34d399"].map((c) => (
                  <span key={c} className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Developer twins"
            description="Active and archived profiles"
            action={
              <Link
                to="/app/twin"
                className="inline-flex items-center gap-1 text-xs font-medium text-neural-300 hover:text-neural-200"
              >
                Manage <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody className="space-y-2.5">
            {team.slice(0, 5).map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-ink-800 bg-ink-900/40 p-2.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ink-700 to-ink-800 text-[11px] font-semibold ring-1 ring-ink-700">
                  {d.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink-50">{d.name}</span>
                    {!d.active ? <Badge tone="slate">departed</Badge> : null}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-400">
                    <Brain className="h-3 w-3 text-neural-300" />
                    <span>expertise {d.expertise}</span>
                    <span className="text-ink-700">•</span>
                    <span>{d.commits} commits</span>
                  </div>
                </div>
                <Sparkline
                  data={Array.from({ length: 12 }, (_, i) => 40 + d.expertise * 0.4 + Math.sin(i + d.expertise / 10) * 6)}
                  width={72}
                  height={28}
                  color={d.active ? "#34d399" : "#656e82"}
                  fill={false}
                />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PageShell>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-ink-300">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
