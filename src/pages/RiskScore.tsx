import { ShieldAlert, TrendingDown, AlertTriangle, Clock, Users, GitBranch } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Progress } from "../components/ui";
import { Sparkline, Ring } from "../components/charts";
import { PageShell } from "../components/Layout";
import { repositories, riskTrend } from "../lib/data";

const components = [
  { name: "Bus factor", value: 38, weight: 35, hint: "1 single-owner service", tone: "rose" as const },
  { name: "Staleness", value: 44, weight: 25, hint: "2 repos >10d since last commit", tone: "amber" as const },
  { name: "Coupling", value: 28, weight: 20, hint: "ledger-core has 5 inbound deps", tone: "cyan" as const },
  { name: "Complexity", value: 41, weight: 20, hint: "cyclomatic avg 14.2", tone: "amber" as const },
];

export default function RiskScore() {
  const critical = repositories.filter((r) => r.risk === "CRITICAL" || r.risk === "HIGH");
  const overall = 38;

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // knowledge risk score
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Knowledge risk score</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-400">
          A weighted composite of bus factor, staleness, coupling, and cyclomatic complexity across your
          organization. Lower is better. Target: &lt; 30.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader
            title="Organization risk"
            description="Weighted composite · updated 6 min ago"
            action={<Badge tone={overall < 40 ? "emerald" : overall < 60 ? "amber" : "rose"}>target &lt; 30</Badge>}
          />
          <CardBody className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
            <Ring value={100 - overall} size={200} stroke={16} label="SAFE" sublabel={`${overall} / 100 risk`} tone="emerald" />
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-400">
                <span>8 weeks ago</span>
                <span>Today</span>
              </div>
              <Sparkline
                data={riskTrend.map((r) => 100 - r.score)}
                width={280}
                height={80}
                color="#34d399"
              />
              <div className="flex items-center gap-2 rounded-lg border border-neural-500/20 bg-neural-500/5 p-2.5 text-xs text-neural-200">
                <TrendingDown className="h-3.5 w-3.5" />
                Risk has dropped 20 points over 8 weeks.
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Component breakdown"
            description="Each factor weighted into the org-level score"
            action={
              <div className="hidden text-[11px] text-ink-500 sm:block">lower bar = safer</div>
            }
          />
          <CardBody className="space-y-5">
            {components.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink-50">{c.name}</span>
                    <span className="font-mono text-[10px] text-ink-500">weight {c.weight}%</span>
                  </div>
                  <span className="tabular-nums text-ink-200">{c.value}/100</span>
                </div>
                <Progress value={c.value} tone={c.tone === "amber" ? "amber" : c.tone === "rose" ? "rose" : c.tone === "cyan" ? "cyan" : "emerald"} className="mt-2" />
                <div className="mt-1 text-[11px] text-ink-500">{c.hint}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="At-risk repositories"
          description="Risk ≥ HIGH or bus factor ≤ 2"
          action={<Badge tone="rose">{critical.length} repos</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-800/60 bg-ink-900/30">
              <tr className="text-[11px] uppercase tracking-wider text-ink-400">
                <th className="px-5 py-3 font-medium">Repository</th>
                <th className="px-5 py-3 font-medium">Risk</th>
                <th className="px-5 py-3 font-medium">Bus factor</th>
                <th className="px-5 py-3 font-medium">Last commit</th>
                <th className="px-5 py-3 font-medium">Knowledge</th>
                <th className="px-5 py-3 font-medium">Contributors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/60">
              {critical.map((r) => (
                <tr key={r.id} className="hover:bg-ink-900/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3.5 w-3.5 text-ink-500" />
                      <div>
                        <div className="font-mono text-[11px] text-ink-500">{r.org}/</div>
                        <div className="font-semibold text-ink-50">{r.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={r.risk === "CRITICAL" ? "rose" : "amber"}>{r.risk}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-ink-500" />
                      <span className="tabular-nums text-ink-100">{r.busFactor}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-ink-500" />
                      <span className="text-ink-200">{r.lastCommit}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-800">
                        <div
                          className={`h-full ${r.knowledgeScore > 75 ? "bg-neural-400" : r.knowledgeScore > 50 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${r.knowledgeScore}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-ink-300">{r.knowledgeScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-200 tabular-nums">{r.contributors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Risk remediation playbook"
          description="AI-suggested actions to drive the score below 30"
          action={<Badge tone="emerald">4 actions</Badge>}
        />
        <CardBody className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: Users,
              title: "Pair-transfer ledger-core",
              body: "Assign arjun.mehta + ananya.rao for a 2-week pairing sprint. Goal: bus factor ≥ 3.",
              impact: "-12 risk",
              tone: "rose" as const,
            },
            {
              icon: AlertTriangle,
              title: "Refresh kyc-pipeline docs",
              body: "Auto-generator confidence is 58%. Manual review + commit comments will close the gap.",
              impact: "-6 risk",
              tone: "amber" as const,
            },
            {
              icon: ShieldAlert,
              title: "Split notification-hub ownership",
              body: "Add rahul.verma to on-call rotation. Currently 2 owners for a service with 8 inbound deps.",
              impact: "-4 risk",
              tone: "cyan" as const,
            },
            {
              icon: Clock,
              title: "Re-commit stale ledger tests",
              body: "Last commit 23d ago. A small refactor + test refresh will pull the staleness component down.",
              impact: "-3 risk",
              tone: "cyan" as const,
            },
          ].map((a) => (
            <div key={a.title} className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
              <div className="flex items-center gap-2">
                <div
                  className={
                    a.tone === "rose"
                      ? "flex h-8 w-8 items-center justify-center rounded-md bg-rose-500/10 text-rose-300"
                      : a.tone === "amber"
                        ? "flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-300"
                        : "flex h-8 w-8 items-center justify-center rounded-md bg-cyber-500/10 text-cyber-300"
                  }
                >
                  <a.icon className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-semibold text-ink-50">{a.title}</h4>
                <Badge tone="emerald" className="ml-auto">{a.impact}</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-400">{a.body}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </PageShell>
  );
}
