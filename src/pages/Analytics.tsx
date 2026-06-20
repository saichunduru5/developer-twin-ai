import { Card, CardHeader, CardBody, Badge } from "../components/ui";
import { Bars, Sparkline, Legend } from "../components/charts";
import { PageShell } from "../components/Layout";
import { activitySeries, team, repositories, aiInsights } from "../lib/data";

export default function Analytics() {
  const totalCommits = activitySeries.reduce((s, d) => s + d.commits, 0);
  const totalReviews = activitySeries.reduce((s, d) => s + d.reviews, 0);
  const totalIncidents = activitySeries.reduce((s, d) => s + d.incidents, 0);

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // analytics
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Analytics</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-400">
          Velocity, quality, and knowledge metrics across your engineering org. All data is derived
          from commit history, PRs, and AI analysis.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile
          label="Commits / week"
          value={totalCommits}
          delta="+12%"
          tone="up"
          series={activitySeries.map((d) => d.commits)}
          color="#34d399"
        />
        <Tile
          label="Reviews / week"
          value={totalReviews}
          delta="+8%"
          tone="up"
          series={activitySeries.map((d) => d.reviews)}
          color="#22d3ee"
        />
        <Tile
          label="Incidents / week"
          value={totalIncidents}
          delta="-50%"
          tone="down"
          series={activitySeries.map((d) => d.incidents)}
          color="#fb7185"
        />
        <Tile
          label="Active twins"
          value={team.filter((t) => t.active).length}
          delta={`${team.length} total`}
          tone="flat"
          series={[3, 3, 3, 4, 4, 4, 4]}
          color="#a78bfa"
        />
      </div>

      {/* Weekly activity */}
      <Card>
        <CardHeader
          title="Weekly engineering activity"
          description="Commits, reviews, and incidents stacked"
          action={
            <Legend
              items={[
                { color: "#34d399", label: "Commits" },
                { color: "#22d3ee", label: "Reviews" },
                { color: "#fb7185", label: "Incidents" },
              ]}
            />
          }
        />
        <CardBody>
          <Bars data={activitySeries.map((d) => ({ label: d.day, commits: d.commits, reviews: d.reviews, incidents: d.incidents }))} width={900} height={260} />
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Per-developer throughput */}
        <Card>
          <CardHeader title="Developer throughput" description="Commits & reviews per developer" />
          <CardBody className="space-y-3">
            {team.map((d) => (
              <div key={d.id} className="rounded-lg border border-ink-800 bg-ink-900/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ink-700 to-ink-800 text-[10px] font-semibold">
                      {d.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink-50">{d.name}</div>
                      <div className="text-[11px] text-ink-400">{d.role.replace("_", " ")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums text-ink-50">
                      {d.commits + d.reviews}
                    </div>
                    <div className="text-[10px] text-ink-500">total contributions</div>
                  </div>
                </div>
                <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-ink-800">
                  <div
                    className="h-full bg-neural-400"
                    style={{ width: `${(d.commits / (d.commits + d.reviews)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-cyber-400"
                    style={{ width: `${(d.reviews / (d.commits + d.reviews)) * 100}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-500">
                  <span>{d.commits} commits</span>
                  <span>{d.reviews} reviews</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Knowledge decay */}
        <Card>
          <CardHeader
            title="Knowledge decay by module"
            description="Higher = faster knowledge loss"
            action={<Badge tone="rose">2 critical</Badge>}
          />
          <CardBody className="space-y-3">
            {[...repositories]
              .sort((a, b) => a.knowledgeScore - b.knowledgeScore)
              .map((r) => (
                <div key={r.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-ink-500">{r.org}/</span>
                      <span className="font-semibold text-ink-50">{r.name}</span>
                      <Badge
                        tone={
                          r.risk === "CRITICAL" ? "rose" : r.risk === "HIGH" ? "amber" : r.risk === "MEDIUM" ? "cyan" : "emerald"
                        }
                      >
                        {r.risk}
                      </Badge>
                    </div>
                    <span className="tabular-nums text-ink-200">{r.knowledgeScore}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
                    <div
                      className={
                        r.knowledgeScore > 75
                          ? "h-full bg-neural-400"
                          : r.knowledgeScore > 50
                            ? "h-full bg-amber-400"
                            : "h-full bg-rose-400"
                      }
                      style={{ width: `${r.knowledgeScore}%` }}
                    />
                  </div>
                </div>
              ))}
          </CardBody>
        </Card>
      </div>

      {/* Insights timeline */}
      <Card>
        <CardHeader
          title="AI insights timeline"
          description="Ranked by severity · last 30 days"
          action={<Badge tone="cyan">{aiInsights.length} insights</Badge>}
        />
        <CardBody>
          <ol className="relative space-y-4 border-l border-ink-800 pl-6">
            {aiInsights.map((i, idx) => (
              <li key={i.id} className="relative">
                <span
                  className={`absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-ink-950 ${
                    i.severity === "CRITICAL"
                      ? "bg-rose-400"
                      : i.severity === "HIGH"
                        ? "bg-amber-400"
                        : i.severity === "MEDIUM"
                          ? "bg-cyber-400"
                          : "bg-neural-400"
                  }`}
                />
                <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        i.severity === "CRITICAL"
                          ? "rose"
                          : i.severity === "HIGH"
                            ? "amber"
                            : i.severity === "MEDIUM"
                              ? "cyan"
                              : "emerald"
                      }
                    >
                      {i.severity}
                    </Badge>
                    <span className="font-mono text-[10px] text-ink-500">{i.module}</span>
                    <span className="ml-auto text-[11px] text-ink-500">{idx + 1}d ago</span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-ink-50">{i.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{i.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </PageShell>
  );
}

function Tile({
  label,
  value,
  delta,
  tone,
  series,
  color,
}: {
  label: string;
  value: number;
  delta: string;
  tone: "up" | "down" | "flat";
  series: number[];
  color: string;
}) {
  const toneClass = tone === "up" ? "text-neural-300" : tone === "down" ? "text-rose-300" : "text-ink-400";
  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">{label}</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums text-ink-50">{value}</div>
          <div className={`mt-0.5 text-xs font-medium ${toneClass}`}>{delta}</div>
        </div>
        <Sparkline data={series} width={120} height={44} color={color} />
      </CardBody>
    </Card>
  );
}
