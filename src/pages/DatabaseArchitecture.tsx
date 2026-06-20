import { useMemo, useState } from "react";
import {
  Database,
  Key,
  Link2,
  Lock,
  Shield,
  Clock,
  Search,
  FileCode,
  Layers,
  GitBranch,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardBody, Badge, Button } from "../components/ui";
import { SkeletonTable, SkeletonCard, QueryState } from "../components/Skeleton";
import { PageShell } from "../components/Layout";
import { useDatabaseSchema, type TableInfo } from "../lib/api/queries";
import { cn } from "../utils/cn";

type TabId = "overview" | "tables" | "relationships" | "indexes" | "softdelete" | "optimistic" | "audit" | "migrations";

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "tables", label: "Tables", icon: Database },
  { id: "relationships", label: "Relationships", icon: Link2 },
  { id: "indexes", label: "Indexes", icon: Key },
  { id: "softdelete", label: "Soft Delete", icon: Shield },
  { id: "optimistic", label: "Optimistic Lock", icon: Lock },
  { id: "audit", label: "Audit Fields", icon: Clock },
  { id: "migrations", label: "Migrations", icon: FileCode },
];

export default function DatabasePage() {
  const { data: schema, isLoading, isError, error, refetch } = useDatabaseSchema();
  const [active, setActive] = useState<TabId>("overview");
  const [selectedTable, setSelectedTable] = useState<string>("users");

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">// database</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Database schema</h1>
        <p className="mt-1.5 max-w-3xl text-sm text-ink-400">
          PostgreSQL 16 schema for Developer Twin AI. UUID primary keys, audit fields, soft delete,
          optimistic locking, row-level security, and partitioned audit log. Every design choice
          documented below.
        </p>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        loadingFallback={
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} title={false} lines={2} />)}
            </div>
            <SkeletonTable rows={8} cols={6} />
          </div>
        }
      >
        {/* Summary tiles */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Tables" value={schema?.tables.length ?? 0} hint="production-ready" />
          <Tile label="Relationships" value={schema?.relationships.length ?? 0} hint="all with ON DELETE rules" />
          <Tile label="Indexes" value={schema?.indexes.length ?? 0} hint="B-tree, partial, composite" />
          <Tile label="Migrations" value={schema?.migrations.length ?? 0} hint="Flyway V1..V7" />
        </div>

        {/* Tabs */}
        <Card>
          <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-ink-800/60 px-3 py-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition",
                    isActive
                      ? "bg-gradient-to-r from-neural-500/15 to-transparent text-ink-50"
                      : "text-ink-300 hover:bg-ink-800/50 hover:text-ink-100",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isActive ? "text-neural-300" : "text-ink-400")} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="p-0">
            {active === "overview" ? <Overview /> : null}
            {active === "tables" && schema ? (
              <Tables
                tables={schema.tables}
                selected={selectedTable}
                onSelect={setSelectedTable}
              />
            ) : null}
            {active === "relationships" && schema ? <Relationships relationships={schema.relationships} /> : null}
            {active === "indexes" && schema ? <Indexes indexes={schema.indexes} /> : null}
            {active === "softdelete" && schema ? <Strategy title="Soft-delete strategy" items={schema.softDeleteStrategy} icon={Shield} tone="emerald" /> : null}
            {active === "optimistic" && schema ? <Strategy title="Optimistic locking strategy" items={schema.optimisticLockStrategy} icon={Lock} tone="cyan" /> : null}
            {active === "audit" && schema ? <Strategy title="Audit-field strategy" items={schema.auditStrategy} icon={Clock} tone="violet" /> : null}
            {active === "migrations" && schema ? <Migrations migrations={schema.migrations} /> : null}
          </div>
        </Card>
      </QueryState>
    </PageShell>
  );
}

function Tile({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Card>
      <CardBody className="py-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">{label}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-2xl font-semibold tabular-nums text-ink-50">{value}</div>
        </div>
        <div className="mt-1 text-[11px] text-ink-500">{hint}</div>
      </CardBody>
    </Card>
  );
}

/* ---------------- Overview with ERD ---------------- */

function Overview() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-sm font-semibold text-ink-50">Entity-relationship diagram</h3>
        <p className="mt-1 text-xs text-ink-400">
          Click a table to jump to its full definition in the Tables tab.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-950/60 p-4">
        <svg viewBox="0 0 1040 720" className="min-w-[1000px]">
          <Entity x={40} y={30} name="tenants" cols={["id UUID PK", "name VARCHAR", "slug VARCHAR UQ", "plan VARCHAR", "settings JSONB", "deleted_at TIMESTAMPTZ", "version INTEGER"]} accent="#34d399" />
          <Entity x={340} y={30} name="users" cols={["id UUID PK", "tenant_id FK → tenants", "email VARCHAR UQ", "password_hash VARCHAR", "full_name VARCHAR", "role ENUM", "deleted_at TIMESTAMPTZ", "version INTEGER"]} accent="#34d399" />
          <Entity x={680} y={30} name="refresh_tokens" cols={["id UUID PK", "user_id FK → users", "token_hash VARCHAR UQ", "family_id UUID", "expires_at TIMESTAMPTZ", "revoked_at TIMESTAMPTZ"]} accent="#a78bfa" />

          <Entity x={40} y={270} name="repositories" cols={["id UUID PK", "tenant_id FK → tenants", "github_id BIGINT", "full_name VARCHAR", "language VARCHAR", "bus_factor SMALLINT", "risk ENUM", "knowledge_score SMALLINT", "deleted_at TIMESTAMPTZ", "version INTEGER"]} accent="#22d3ee" />
          <Entity x={380} y={270} name="commits" cols={["id UUID PK", "repository_id FK → repos", "sha CHAR(40) UQ", "author_email VARCHAR", "message TEXT", "authored_at TIMESTAMPTZ", "embedding_id VARCHAR"]} accent="#22d3ee" />
          <Entity x={720} y={270} name="developer_twins" cols={["id UUID PK", "tenant_id FK → tenants", "user_id FK → users (NULL)", "email VARCHAR", "expertise_score SMALLINT", "skills JSONB", "languages JSONB", "active BOOLEAN", "deleted_at TIMESTAMPTZ", "version INTEGER"]} accent="#22d3ee" />

          <Entity x={40} y={530} name="knowledge_nodes" cols={["id UUID PK", "tenant_id FK → tenants", "label VARCHAR", "type ENUM", "risk REAL", "owner_count SMALLINT", "metadata JSONB", "deleted_at TIMESTAMPTZ", "version INTEGER"]} accent="#fbbf24" />
          <Entity x={380} y={530} name="knowledge_edges" cols={["id UUID PK", "tenant_id FK → tenants", "from_node_id FK → nodes", "to_node_id FK → nodes", "weight SMALLINT", "deleted_at TIMESTAMPTZ"]} accent="#fbbf24" />
          <Entity x={720} y={530} name="documents" cols={["id UUID PK", "tenant_id FK → tenants", "repository_id FK → repos", "title VARCHAR", "content TEXT", "coverage SMALLINT", "generated_at TIMESTAMPTZ", "deleted_at TIMESTAMPTZ", "version INTEGER"]} accent="#22d3ee" />

          <Entity x={720} y={680} name="chat_messages" cols={["id UUID PK", "tenant_id FK", "user_id FK → users", "role ENUM", "content TEXT", "sources JSONB", "latency_ms INTEGER"]} accent="#fb7185" />

          {/* Relationships */}
          <Rel from={[260, 80]} to={[340, 80]} label="N:1" />
          <Rel from={[580, 80]} to={[680, 80]} label="N:1" />
          <Rel from={[260, 100]} to={[260, 270]} label="N:1" />
          <Rel from={[580, 320]} to={[720, 320]} label="N:1" />
          <Rel from={[260, 320]} to={[720, 340]} label="N:1" dashed />
          <Rel from={[260, 340]} to={[260, 530]} label="N:1" />
          <Rel from={[580, 570]} to={[720, 570]} label="N:1" />
          <Rel from={[260, 570]} to={[380, 570]} label="N:1" />
          <Rel from={[380, 580]} to={[380, 530]} label="N:1" dashed />
          <Rel from={[580, 320]} to={[940, 700]} label="N:1" dashed />

          {/* Legend */}
          <g transform="translate(40,690)">
            <text fontSize={10} fill="#8891a3" y={0}>LEGEND</text>
            <circle cx={8} cy={16} r={4} fill="#34d399" />
            <text x={18} y={20} fontSize={10} fill="#b2b9c6">Tenant boundary</text>
            <circle cx={130} cy={16} r={4} fill="#22d3ee" />
            <text x={140} y={20} fontSize={10} fill="#b2b9c6">Domain data</text>
            <circle cx={240} cy={16} r={4} fill="#fbbf24" />
            <text x={250} y={20} fontSize={10} fill="#b2b9c6">Knowledge graph</text>
            <circle cx={370} cy={16} r={4} fill="#a78bfa" />
            <text x={380} y={20} fontSize={10} fill="#b2b9c6">Auth</text>
            <circle cx={430} cy={16} r={4} fill="#fb7185" />
            <text x={440} y={20} fontSize={10} fill="#b2b9c6">Compliance</text>
            <line x1={520} y1={16} x2={548} y2={16} stroke="#8891a3" strokeWidth={1.5} />
            <text x={554} y={20} fontSize={10} fill="#b2b9c6">FK (cascade)</text>
            <line x1={630} y1={16} x2={658} y2={16} stroke="#8891a3" strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={664} y={20} fontSize={10} fill="#b2b9c6">FK (set null)</text>
          </g>
        </svg>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Highlight title="UUID v7 primary keys" body="Time-sortable UUIDs give better B-tree locality than random UUID v4. Generated via gen_random_uuid() at the DB layer; client IDs are never trusted." />
        <Highlight title="Row-level security" body="Every tenant-scoped table has RLS policies on tenant_id. Spring sets app.tenant_id as a session variable per request. Defense in depth even if application filtering fails." />
        <Highlight title="Partitioned audit log" body="audit_log is PARTITION BY RANGE on created_at (monthly). Keeps queries fast at 100M+ rows and enables cheap retention via DROP PARTITION." />
      </div>
    </div>
  );
}

/* ---------------- Tables ---------------- */

function Tables({
  tables,
  selected,
  onSelect,
}: {
  tables: TableInfo[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const filtered = useMemo(
    () => tables.filter((t) => t.name.includes(filter.toLowerCase())),
    [tables, filter],
  );
  const active = tables.find((t) => t.name === selected) ?? tables[0];

  return (
    <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
      <div className="border-b border-ink-800/60 lg:border-b-0 lg:border-r">
        <div className="border-b border-ink-800/60 p-3">
          <div className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/60 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-ink-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tables"
              className="flex-1 bg-transparent text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {filtered.map((t) => (
            <button
              key={t.name}
              onClick={() => onSelect(t.name)}
              className={cn(
                "flex w-full items-center justify-between gap-2 border-b border-ink-800/40 px-4 py-3 text-left text-sm transition hover:bg-ink-900/40",
                selected === t.name ? "bg-ink-900/60" : "",
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 shrink-0 text-cyber-300" />
                  <span className="truncate font-mono text-[12px] font-semibold text-ink-50">{t.name}</span>
                </div>
                <div className="mt-0.5 truncate text-[10px] text-ink-500">{t.purpose}</div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {t.softDelete ? <Badge tone="amber">soft</Badge> : null}
                {t.optimisticLock ? <Badge tone="cyan">OL</Badge> : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {active ? <TableDetail table={active} /> : null}
      </div>
    </div>
  );
}

function TableDetail({ table }: { table: TableInfo }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-cyber-300" />
            <h3 className="font-mono text-lg font-semibold text-ink-50">{table.name}</h3>
            {table.softDelete ? <Badge tone="amber">soft-delete</Badge> : null}
            {table.optimisticLock ? <Badge tone="cyan">optimistic-lock</Badge> : null}
          </div>
          <p className="mt-1 text-xs text-ink-400">{table.purpose}</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-ink-400">
          <span>~{table.rowsEstimate} rows</span>
          <span>{table.columns.length} columns</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink-900/60 text-[10px] uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-3 py-2 font-medium">Column</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Null</th>
              <th className="px-3 py-2 font-medium">Key / Constraints</th>
              <th className="px-3 py-2 font-medium">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/60 bg-ink-950/40 font-mono">
            {table.columns.map((c) => (
              <tr key={c.name} className="hover:bg-ink-900/40">
                <td className="px-3 py-2 font-semibold text-ink-100">
                  <div className="flex items-center gap-2">
                    {c.name}
                    {c.audit ? <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-violet-300">audit</span> : null}
                  </div>
                </td>
                <td className="px-3 py-2 text-cyber-300">{c.type}</td>
                <td className="px-3 py-2 text-ink-400">{c.nullable ? "YES" : "NO"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {c.pk ? <Badge tone="emerald">PK</Badge> : null}
                    {c.uq ? <Badge tone="cyan">UQ</Badge> : null}
                    {c.fk ? <Badge tone="violet">FK→{c.fk}</Badge> : null}
                    {c.indexed ? <Badge tone="slate">idx</Badge> : null}
                  </div>
                </td>
                <td className="px-3 py-2 text-ink-400">{c.default ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Relationships ---------------- */

function Relationships({ relationships }: { relationships: { from: string; to: string; type: string; onDelete: string }[] }) {
  return (
    <div className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-ink-50">Foreign-key relationships</h3>
      <div className="overflow-x-auto rounded-xl border border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900/60 text-[11px] uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">From</th>
              <th className="px-4 py-2.5 font-medium" />
              <th className="px-4 py-2.5 font-medium">To</th>
              <th className="px-4 py-2.5 font-medium">Cardinality</th>
              <th className="px-4 py-2.5 font-medium">ON DELETE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/60 bg-ink-950/40">
            {relationships.map((r, i) => (
              <tr key={i} className="hover:bg-ink-900/40">
                <td className="px-4 py-2.5 font-mono text-ink-100">{r.from}</td>
                <td className="px-4 py-2.5 text-ink-500">→</td>
                <td className="px-4 py-2.5 font-mono text-ink-100">{r.to}</td>
                <td className="px-4 py-2.5"><Badge tone="cyan">{r.type}</Badge></td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-ink-300">{r.onDelete}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Indexes ---------------- */

function Indexes({ indexes }: { indexes: { table: string; name: string; columns: string; kind: string; purpose: string }[] }) {
  return (
    <div className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-ink-50">Indexes ({indexes.length})</h3>
      <div className="overflow-x-auto rounded-xl border border-ink-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink-900/60 text-[10px] uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">Table</th>
              <th className="px-4 py-2.5 font-medium">Index name</th>
              <th className="px-4 py-2.5 font-medium">Columns</th>
              <th className="px-4 py-2.5 font-medium">Kind</th>
              <th className="px-4 py-2.5 font-medium">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/60 bg-ink-950/40">
            {indexes.map((i, idx) => (
              <tr key={idx} className="hover:bg-ink-900/40">
                <td className="px-4 py-2.5 font-mono text-ink-100">{i.table}</td>
                <td className="px-4 py-2.5 font-mono text-cyber-300">{i.name}</td>
                <td className="px-4 py-2.5 font-mono text-ink-300">{i.columns}</td>
                <td className="px-4 py-2.5"><Badge tone="slate">{i.kind}</Badge></td>
                <td className="px-4 py-2.5 text-ink-400">{i.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Strategy ---------------- */

function Strategy({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: "emerald" | "cyan" | "violet";
}) {
  const toneClass =
    tone === "emerald" ? "bg-neural-500/10 text-neural-300" : tone === "cyan" ? "bg-cyber-500/10 text-cyber-300" : "bg-violet-500/10 text-violet-300";
  return (
    <div className="p-6">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-ink-50">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-start gap-3 rounded-lg border border-ink-800 bg-ink-900/40 p-4">
            <div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold", toneClass)}>
              {idx + 1}
            </div>
            <div className="text-sm leading-relaxed text-ink-200">{i}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Migrations ---------------- */

function Migrations({ migrations }: { migrations: { version: string; name: string; sql: string }[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = migrations[active];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.sql);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
      <div className="border-b border-ink-800/60 lg:border-b-0 lg:border-r">
        <div className="border-b border-ink-800/60 p-4">
          <div className="text-[11px] font-medium uppercase tracking-widest text-ink-400">Flyway migrations</div>
          <div className="mt-1 text-[10px] text-ink-500">db/migration/ in the backend repo</div>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {migrations.map((m, i) => (
            <button
              key={m.version}
              onClick={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-ink-800/40 px-4 py-3 text-left transition hover:bg-ink-900/40",
                active === i ? "bg-ink-900/60" : "",
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neural-500/10 font-mono text-[11px] font-semibold text-neural-300">
                {m.version}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[11px] font-semibold text-ink-50">
                  {m.version}__{m.name}.sql
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-500">
                  <CheckCircle2 className="h-2.5 w-2.5 text-neural-300" />
                  applied
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] text-ink-500">db/migration/</div>
            <div className="font-mono text-sm font-semibold text-ink-50">
              {current.version}__{current.name}.sql
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={copy}>
            {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </Button>
        </div>
        <pre className="max-h-[480px] overflow-auto rounded-xl border border-ink-800 bg-ink-950/60 p-5 font-mono text-[12px] leading-relaxed text-ink-200">
          {current.sql}
        </pre>
      </div>
    </div>
  );
}

/* ---------------- SVG primitives ---------------- */

function Entity({
  x,
  y,
  name,
  cols,
  accent,
}: {
  x: number;
  y: number;
  name: string;
  cols: string[];
  accent: string;
}) {
  const h = 30 + cols.length * 16;
  return (
    <g>
      <rect x={x} y={y} width={260} height={h} rx={8} fill="#121624" stroke={accent} strokeWidth={1.5} />
      <rect x={x} y={y} width={260} height={26} rx={8} fill={accent} opacity={0.15} />
      <text x={x + 10} y={y + 17} fontSize={11} fontWeight={700} fill={accent} fontFamily="monospace">
        {name}
      </text>
      {cols.map((c, i) => (
        <text key={i} x={x + 10} y={y + 42 + i * 16} fontSize={9.5} fill="#d6dae2" fontFamily="monospace">
          {c}
        </text>
      ))}
    </g>
  );
}

function Rel({
  from,
  to,
  label,
  dashed,
}: {
  from: [number, number];
  to: [number, number];
  label?: string;
  dashed?: boolean;
}) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  return (
    <g>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke="#656e82"
        strokeWidth={1.2}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
      {label ? (
        <g transform={`translate(${midX - 14}, ${midY - 8})`}>
          <rect width={28} height={16} rx={3} fill="#1f2434" stroke="#343a4c" />
          <text x={14} y={11} textAnchor="middle" fontSize={9} fill="#b2b9c6" fontFamily="monospace">
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function Highlight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-3.5 w-3.5 text-neural-300" />
        <h4 className="text-sm font-semibold text-ink-50">{title}</h4>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-400">{body}</p>
    </div>
  );
}
