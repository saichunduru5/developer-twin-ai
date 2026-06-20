import { useState } from "react";
import { Brain, GitCommit, MessageSquare, Code, Clock, TestTube2 } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Progress } from "../components/ui";
import { Radar, Heatmap } from "../components/charts";
import { PageShell } from "../components/Layout";
import { team } from "../lib/data";
import type { Developer } from "../lib/types";

export default function DeveloperTwin() {
  const [activeId, setActiveId] = useState<string>(team[0].id);
  const dev = team.find((d) => d.id === activeId) ?? team[0];

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // developer twin
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Developer Twins</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          An AI model of each engineer, trained on their commits, reviews, and decisions. Active twins update in real time; departed twins are preserved as read-only knowledge assets.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr]">
        {/* Roster */}
        <Card>
          <CardHeader title="Team roster" description="Select a twin to inspect" />
          <div className="divide-y divide-ink-800/60">
            {team.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-ink-900/40 ${
                  activeId === d.id ? "bg-ink-900/60" : ""
                }`}
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ink-700 to-ink-800 text-[12px] font-semibold text-ink-100 ring-1 ring-ink-700">
                    {d.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-ink-950 ${
                      d.active ? "bg-neural-400" : "bg-ink-500"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink-50">{d.name}</span>
                    {!d.active ? <Badge tone="slate">departed</Badge> : null}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-ink-400">
                    <span>{d.role.replace("_", " ")}</span>
                    <span>•</span>
                    <span>tenure {d.tenure}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-ink-500">expertise</div>
                  <div className="text-sm font-semibold tabular-nums text-ink-50">{d.expertise}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Detail */}
        <div className="space-y-4">
          <TwinHeader dev={dev} />
          <div className="grid gap-4 md:grid-cols-2">
            <TwinSkills dev={dev} />
            <TwinStyle dev={dev} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TwinLanguages dev={dev} />
            <TwinActivity />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function TwinHeader({ dev }: { dev: Developer }) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neural-500 to-cyber-500 text-lg font-semibold text-ink-950 shadow-lg shadow-neural-500/30">
                {dev.avatar}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-ink-950 ${
                  dev.active ? "bg-neural-400 animate-pulse-ring" : "bg-ink-500"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-ink-50">{dev.name}</h2>
                {!dev.active ? <Badge tone="slate">archived twin</Badge> : <Badge tone="emerald">live twin</Badge>}
              </div>
              <div className="mt-1 font-mono text-[11px] text-ink-400">@{dev.handle}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <Badge tone="cyan">{dev.role.replace("_", " ")}</Badge>
                <Badge tone="slate">tenure {dev.tenure}</Badge>
                <Badge tone="slate">{dev.commits} commits</Badge>
                <Badge tone="slate">{dev.reviews} reviews</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-ink-800 bg-ink-900/40 p-3">
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#1f2434" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="url(#grad-exp)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15}
                  strokeDashoffset={2 * Math.PI * 15 * (1 - dev.expertise / 100)}
                />
                <defs>
                  <linearGradient id="grad-exp" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-ink-50">
                {dev.expertise}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-ink-500">Expertise</div>
              <div className="text-xs text-ink-300">composite score</div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function TwinSkills({ dev }: { dev: Developer }) {
  return (
    <Card>
      <CardHeader
        title="Skill radar"
        description="Inferred from commit context, code ownership and review patterns"
        action={<Badge tone="cyan">AI-inferred</Badge>}
      />
      <CardBody>
        <Radar skills={dev.skills} size={260} />
        <div className="mt-4 space-y-2">
          {dev.skills.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-300">{s.name}</span>
                <span className="tabular-nums text-ink-200">{s.score}</span>
              </div>
              <Progress value={s.score} className="mt-1" tone="emerald" />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function TwinStyle({ dev }: { dev: Developer }) {
  const s = dev.codingStyle;
  const rows = [
    { icon: Code, label: "Avg PR size", value: `${s.avgPrSize} lines`, hint: s.avgPrSize < 250 ? "small, focused" : s.avgPrSize < 400 ? "balanced" : "large PRs" },
    { icon: Clock, label: "Avg review time", value: `${s.avgReviewTimeMin} min`, hint: s.avgReviewTimeMin < 30 ? "fast" : "deliberate" },
    { icon: TestTube2, label: "Test coverage", value: `${s.testCoverage}%`, hint: s.testCoverage > 85 ? "excellent" : s.testCoverage > 70 ? "good" : "needs work" },
    { icon: MessageSquare, label: "Doc comments", value: `${s.docComments}%`, hint: s.docComments > 75 ? "thorough" : "concise" },
    { icon: GitCommit, label: "Total commits", value: dev.commits.toString(), hint: "lifetime" },
    { icon: Brain, label: "Expertise", value: dev.expertise.toString(), hint: "composite" },
  ];
  return (
    <Card>
      <CardHeader title="Coding style" description="Behavioral signals from commit history" />
      <CardBody className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/40 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-800/60 text-ink-300">
              <r.icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-ink-400">{r.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold tabular-nums text-ink-50">{r.value}</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-500">{r.hint}</span>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function TwinLanguages({ dev }: { dev: Developer }) {
  return (
    <Card>
      <CardHeader title="Language footprint" description="Share of commits per language" />
      <CardBody>
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {dev.topLanguages.map((l) => (
            <div
              key={l.name}
              style={{
                width: `${l.pct}%`,
                background:
                  l.name === "Java"
                    ? "#f97316"
                    : l.name === "TypeScript" || l.name === "React"
                      ? "#3b82f6"
                      : l.name === "Python"
                        ? "#22c55e"
                        : l.name === "Go"
                          ? "#06b6d4"
                          : l.name === "Kotlin"
                            ? "#a78bfa"
                            : "#8891a3",
              }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {dev.topLanguages.map((l) => (
            <div key={l.name} className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background:
                      l.name === "Java"
                        ? "#f97316"
                        : l.name === "TypeScript"
                          ? "#3b82f6"
                          : l.name === "Python"
                            ? "#22c55e"
                            : "#8891a3",
                  }}
                />
                <span className="text-sm text-ink-100">{l.name}</span>
              </div>
              <span className="text-xs tabular-nums text-ink-300">{l.pct}%</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function TwinActivity() {
  return (
    <Card>
      <CardHeader title="Activity heatmap" description="Last 26 weeks" action={<Badge tone="emerald">active</Badge>} />
      <CardBody>
        <Heatmap weeks={22} seed={7} />
      </CardBody>
    </Card>
  );
}
