import { useState } from "react";
import { Network, AlertTriangle, Users as UsersIcon } from "lucide-react";
import { Card, CardHeader, CardBody, Badge } from "../components/ui";
import { KnowledgeGraph } from "../components/charts";
import { PageShell } from "../components/Layout";
import { knowledgeEdges, knowledgeNodes } from "../lib/data";

const typeLegend = [
  { color: "#34d399", label: "Service" },
  { color: "#22d3ee", label: "Database" },
  { color: "#a78bfa", label: "Queue" },
  { color: "#fbbf24", label: "API" },
];

const riskLegend = [
  { color: "#34d399", label: "Low (<0.4)" },
  { color: "#fbbf24", label: "Medium (0.4–0.75)" },
  { color: "#fb7185", label: "High (≥0.75)" },
];

export default function KnowledgeMap() {
  const [selected, setSelected] = useState<string | null>("ledger");

  const node = knowledgeNodes.find((n) => n.id === selected);
  const neighbors = selected
    ? knowledgeEdges
        .filter((e) => e.from === selected || e.to === selected)
        .map((e) => {
          const otherId = e.from === selected ? e.to : e.from;
          const other = knowledgeNodes.find((n) => n.id === otherId);
          return other ? { node: other, direction: e.from === selected ? "out" : "in", weight: e.weight } : null;
        })
        .filter(Boolean) as { node: (typeof knowledgeNodes)[number]; direction: "in" | "out"; weight: number }[]
    : [];

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // knowledge dependency map
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Knowledge dependency map</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-400">
          Auto-discovered service graph. Node size scales with ownership breadth; color encodes
          knowledge risk (bus factor × staleness × coupling). Click any node to inspect.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Service graph"
            description="acme-fintech · auto-discovered from commit ownership"
            action={
              <div className="flex items-center gap-4">
                <Legend items={typeLegend} />
                <Legend items={riskLegend} />
              </div>
            }
          />
          <CardBody className="p-0">
            <KnowledgeGraph
              nodes={knowledgeNodes}
              edges={knowledgeEdges}
              onSelect={setSelected}
              selectedId={selected}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          {node ? (
            <Card>
              <CardHeader
                title={node.label}
                description={`${node.type.toUpperCase()} · risk ${(node.risk * 100).toFixed(0)}%`}
                action={
                  <Badge
                    tone={node.risk >= 0.75 ? "rose" : node.risk >= 0.5 ? "amber" : "emerald"}
                  >
                    {node.risk >= 0.75 ? "HIGH" : node.risk >= 0.5 ? "MEDIUM" : "LOW"}
                  </Badge>
                }
              />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Mini label="Owners" value={node.ownerCount} icon={<UsersIcon className="h-3.5 w-3.5" />} />
                  <Mini label="Risk" value={`${(node.risk * 100).toFixed(0)}%`} icon={<AlertTriangle className="h-3.5 w-3.5" />} />
                  <Mini
                    label="Inbound deps"
                    value={neighbors.filter((n) => n.direction === "in").length}
                    icon={<Network className="h-3.5 w-3.5" />}
                  />
                  <Mini
                    label="Outbound deps"
                    value={neighbors.filter((n) => n.direction === "out").length}
                    icon={<Network className="h-3.5 w-3.5" />}
                  />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-500">Neighbors</div>
                  <div className="mt-2 space-y-1.5">
                    {neighbors.map((n, i) => (
                      <button
                        key={i}
                        onClick={() => setSelected(n.node.id)}
                        className="flex w-full items-center justify-between rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2 text-left transition hover:border-ink-700"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: typeColor(n.node.type) }}
                          />
                          <span className="text-sm text-ink-100">{n.node.label}</span>
                          <span className="font-mono text-[10px] text-ink-500">
                            {n.direction === "out" ? "→ out" : "← in"}
                          </span>
                        </div>
                        <span className="text-[11px] text-ink-400">w={n.weight}</span>
                      </button>
                    ))}
                    {neighbors.length === 0 ? (
                      <div className="py-3 text-center text-xs text-ink-500">No neighbors.</div>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="py-10 text-center text-sm text-ink-400">
                Select a node on the graph to see details.
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Hot spots" description="Top risk nodes requiring attention" />
            <CardBody className="space-y-2">
              {[...knowledgeNodes]
                .sort((a, b) => b.risk - a.risk)
                .slice(0, 5)
                .map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelected(n.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2.5 text-left transition hover:border-ink-700"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: n.risk >= 0.75 ? "#fb7185" : n.risk >= 0.5 ? "#fbbf24" : "#34d399" }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-ink-50">{n.label}</div>
                        <div className="text-[11px] text-ink-400">{n.ownerCount} {n.ownerCount === 1 ? "owner" : "owners"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums text-ink-50">{(n.risk * 100).toFixed(0)}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-500">risk</div>
                    </div>
                  </button>
                ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="hidden items-center gap-3 text-[11px] text-ink-300 md:flex">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: i.color }} />
          {i.label}
        </div>
      ))}
    </div>
  );
}

function typeColor(t: string) {
  switch (t) {
    case "service":
      return "#34d399";
    case "db":
      return "#22d3ee";
    case "queue":
      return "#a78bfa";
    case "api":
      return "#fbbf24";
    default:
      return "#8891a3";
  }
}

function Mini({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-500">
        <span className="text-ink-400">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-ink-50">{value}</div>
    </div>
  );
}
