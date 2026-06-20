import { Link } from "react-router-dom";
import {
  Sparkles,
  GitBranch,
  Users,
  MessageSquareText,
  Network,
  ShieldAlert,
  LineChart,
  Search,
  FileText,
  Cpu,
  Database,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle2,
  Brain,
  Layers,
} from "lucide-react";
import { Button, Card } from "../components/ui";
import { Ring } from "../components/charts";
import { knowledgeHealth } from "../lib/data";

const features = [
  {
    icon: GitBranch,
    title: "Repository Management",
    body: "Connect GitHub orgs. Track commits, PRs, reviewers. Ingest commit context into the vector store.",
    tone: "emerald" as const,
  },
  {
    icon: Users,
    title: "Developer Twin",
    body: "Per-developer AI twin: skills radar, coding style, expertise score, mentorship footprint.",
    tone: "cyan" as const,
  },
  {
    icon: MessageSquareText,
    title: "Ask Former Employee",
    body: "RAG over commits, PRs, and docs. Answers cite the exact commit and author who made the decision.",
    tone: "violet" as const,
  },
  {
    icon: Network,
    title: "Knowledge Dependency Map",
    body: "Auto-discovered service graph weighted by commit ownership, coupling, and knowledge staleness.",
    tone: "emerald" as const,
  },
  {
    icon: ShieldAlert,
    title: "Knowledge Risk Score",
    body: "Bus-factor, staleness, coupling and complexity rolled into one actionable number per service.",
    tone: "rose" as const,
  },
  {
    icon: Brain,
    title: "AI Chat Assistant",
    body: "Gemini-powered assistant with full repo context. Streaming responses, grounded in sources.",
    tone: "cyan" as const,
  },
  {
    icon: FileText,
    title: "Auto Documentation",
    body: "Generates and refreshes module-level docs from code + commit history. Flags coverage gaps.",
    tone: "emerald" as const,
  },
  {
    icon: Search,
    title: "Knowledge Search",
    body: "Hybrid vector + keyword search over commits, PRs, docs, and code. Re-ranked by Gemini.",
    tone: "violet" as const,
  },
  {
    icon: LineChart,
    title: "Analytics",
    body: "Team velocity, review bottlenecks, knowledge decay curves, single-owner warnings.",
    tone: "cyan" as const,
  },
];

const stack = [
  { label: "Java 21", sub: "virtual threads" },
  { label: "Spring Boot 3", sub: "Spring Security" },
  { label: "PostgreSQL", sub: "primary store" },
  { label: "ChromaDB", sub: "vector store" },
  { label: "Gemini API", sub: "LLM + embeddings" },
  { label: "React + TS", sub: "SPA shell" },
];

const securityStrip = [
  "BCrypt password hashing",
  "JWT access + refresh (httpOnly)",
  "RBAC: ADMIN · TEAM_LEAD · DEVELOPER",
  "Input validation + DTOs",
  "SQL injection & XSS prevention",
  "CORS + CSRF + centralized exception handler",
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* Nav */}
      <header className="relative z-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500 to-cyber-500 shadow-lg shadow-neural-500/30">
                <Sparkles className="h-4 w-4 text-ink-950" />
              </div>
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-neural-400 animate-pulse-ring" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-ink-50">Developer Twin AI</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Chunduru Sai</div>
            </div>
          </div>
          <nav className="ml-6 hidden items-center gap-6 text-sm text-ink-300 md:flex">
            <a href="#features" className="hover:text-ink-50">Features</a>
            <a href="#architecture" className="hover:text-ink-50">Architecture</a>
            <a href="#security" className="hover:text-ink-50">Security</a>
            <a href="#stack" className="hover:text-ink-50">Stack</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/login" className="hidden text-sm text-ink-300 hover:text-ink-50 sm:block">
              Sign in
            </Link>
            <Link to="/app">
              <Button size="sm">
                Launch dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-24">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-300">
              <span className="h-1.5 w-1.5 rounded-full bg-neural-400 animate-pulse" />
              Production-grade SaaS · v1.0
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-ink-50 sm:text-5xl lg:text-6xl">
              People leave.
              <br />
              <span className="bg-gradient-to-r from-neural-300 via-neural-400 to-cyber-400 bg-clip-text text-transparent">
                Knowledge stays.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
              Developer Twin AI preserves your team's engineering knowledge by creating{" "}
              <span className="text-ink-50">AI-powered digital twins</span> of every developer —
              trained on their commits, reviews, decisions, and domain context.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/app">
                <Button>
                  Explore the dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/app/architecture">
                <Button variant="outline">
                  <Layers className="h-4 w-4" /> Read architecture
                </Button>
              </Link>
            </div>
            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6">
              {[
                { k: "74", v: "Knowledge Health", sub: "acme-fintech org" },
                { k: "1,286", v: "Commits indexed", sub: "last 90 days" },
                { k: "38", v: "Risk score", sub: "lower is better" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-semibold tracking-tight text-ink-50 tabular-nums">{s.k}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-400">{s.v}</div>
                  <div className="text-[11px] text-ink-500">{s.sub}</div>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero visual: mini dashboard card */}
          <div className="relative">
            <div className="absolute -inset-12 -z-10 bg-gradient-to-tr from-neural-500/20 via-transparent to-cyber-500/20 blur-3xl" />
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-800/60 bg-ink-900/40 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neural-400/70" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
                  knowledge.twin
                </div>
              </div>
              <div className="grid grid-cols-5 gap-0">
                <div className="col-span-2 border-r border-ink-800/60 p-5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Health</div>
                  <div className="mt-3 flex justify-center">
                    <Ring value={knowledgeHealth.overall} size={150} stroke={12} label="Overall" tone="emerald" />
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    {[
                      ["Documented", 68, "cyan" as const],
                      ["Bus factor", 62, "amber" as const],
                      ["Freshness", 81, "emerald" as const],
                    ].map(([l, v, t]) => (
                      <div key={l as string} className="flex items-center gap-2">
                        <span className="w-20 text-ink-400">{l as string}</span>
                        <div className="h-1.5 flex-1 rounded-full bg-ink-800">
                          <div
                            className={
                              t === "emerald"
                                ? "h-full rounded-full bg-neural-400"
                                : t === "cyan"
                                  ? "h-full rounded-full bg-cyber-400"
                                  : "h-full rounded-full bg-amber-400"
                            }
                            style={{ width: `${v as number}%` }}
                          />
                        </div>
                        <span className="w-8 text-right tabular-nums text-ink-200">{v as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-3 space-y-3 p-5">
                  <div className="flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 text-neural-300" />
                    <div className="text-[11px] font-medium uppercase tracking-wider text-ink-300">
                      AI Insights
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { c: "rose", t: "ledger-core has a bus factor of 1" },
                      { c: "amber", t: "kyc-pipeline docs are 11d stale" },
                      { c: "cyan", t: "Rahul Verma crossed 90% in React" },
                    ].map((i) => (
                      <div key={i.t} className="flex items-start gap-2 rounded-lg border border-ink-800 bg-ink-900/40 p-2.5">
                        <span
                          className={
                            i.c === "rose"
                              ? "mt-1 h-1.5 w-1.5 rounded-full bg-rose-400"
                              : i.c === "amber"
                                ? "mt-1 h-1.5 w-1.5 rounded-full bg-amber-400"
                                : "mt-1 h-1.5 w-1.5 rounded-full bg-cyber-400"
                          }
                        />
                        <div className="text-xs text-ink-200">{i.t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            {/* Floating twin chip */}
            <div className="absolute -bottom-4 -left-4 hidden animate-float-slow sm:block">
              <div className="glass flex items-center gap-3 rounded-xl border border-ink-800 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-400 to-neural-500">
                  <Users className="h-4 w-4 text-ink-950" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">Twin of</div>
                  <div className="text-xs font-semibold text-ink-100">priya.nair</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
              // 01 — Core capabilities
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
              Twelve modules. One knowledge surface.
            </h2>
            <p className="mt-3 text-ink-400">
              Every engineering decision your team has ever made becomes searchable, citable, and transferable.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} hover className="group">
                <div className="p-5">
                  <div
                    className={
                      f.tone === "emerald"
                        ? "flex h-10 w-10 items-center justify-center rounded-lg border border-neural-500/30 bg-neural-500/10 text-neural-300"
                        : f.tone === "cyan"
                          ? "flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-500/30 bg-cyber-500/10 text-cyber-300"
                          : f.tone === "rose"
                            ? "flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300"
                            : "flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300"
                    }
                  >
                    <f.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-ink-50">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{f.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture teaser */}
      <section id="architecture" className="relative z-10 border-y border-ink-800/60 bg-ink-950/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
              // 02 — Architecture
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
              Built for real engineering orgs.
            </h2>
            <p className="mt-3 text-ink-400">
              Clean architecture on the backend, SOLID throughout, JWT-secured endpoints, and a vector
              layer that actually scales. No placeholders. No shortcuts.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["Java 21", "virtual threads"],
                ["Spring Boot 3", "Spring Security"],
                ["PostgreSQL", "row-level security"],
                ["ChromaDB", "vector embeddings"],
                ["Gemini API", "LLM + rerank"],
                ["React + TS", "typed SPA"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-lg border border-ink-800 bg-ink-900/40 p-3">
                  <div className="text-sm font-semibold text-ink-50">{t}</div>
                  <div className="mt-0.5 text-[11px] text-ink-400">{s}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/app/architecture">
                <Button variant="outline">
                  <Layers className="h-4 w-4" /> View full architecture spec
                </Button>
              </Link>
            </div>
          </div>

          {/* ASCII-style diagram */}
          <div className="relative">
            <Card className="p-0">
              <div className="flex items-center justify-between border-b border-ink-800/60 bg-ink-900/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-ink-400" />
                  <span className="font-mono text-[11px] text-ink-300">system-architecture.mermaid</span>
                </div>
                <span className="font-mono text-[10px] text-ink-500">read-only</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-relaxed text-ink-200">
{`┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   React SPA  │───▶│  Spring Boot │───▶│  PostgreSQL  │
│   (TS/RTK)   │    │  3 + JWT     │    │  (primary)   │
└──────────────┘    └──────┬───────┘    └──────────────┘
                           │
                   ┌───────┼────────┐
                   ▼       ▼        ▼
            ┌──────────┐ ┌──────┐ ┌────────┐
            │ ChromaDB │ │Gemini│ │ GitHub │
            │ (vector) │ │ API  │ │  API   │
            └──────────┘ └──────┘ └────────┘

            knowledge ingestion  ──▶  embeddings
            RAG query path       ◀──  rerank (Gemini)`}
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Security strip */}
      <section id="security" className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
                // 03 — Security posture
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
                Security is not a feature. It's a default.
              </h2>
              <p className="mt-3 text-ink-400">
                Every endpoint validated. Every cookie hardened. Every query parameterized. Zero trust
                by construction.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {securityStrip.map((s) => (
                <div key={s} className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/40 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-neural-400" />
                  <span className="text-sm text-ink-100">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="relative z-10 border-t border-ink-800/60 bg-ink-950/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
                // 04 — Tech stack
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
                Modern. Typed. Battle-tested.
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-400">
              <Lock className="h-3.5 w-3.5" />
              Self-hostable · SOC 2 aligned
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((s) => (
              <div
                key={s.label}
                className="group flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900/40 p-4 transition hover:border-neural-500/30 hover:bg-ink-900/60"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-ink-400 group-hover:text-neural-300" />
                  <div>
                    <div className="text-sm font-semibold text-ink-50">{s.label}</div>
                    <div className="text-[11px] text-ink-500">{s.sub}</div>
                  </div>
                </div>
                <Zap className="h-3.5 w-3.5 text-ink-600 group-hover:text-neural-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-neural-500/20 bg-gradient-to-br from-ink-900 via-ink-900 to-neural-500/5">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
                  Stop losing knowledge when people leave.
                </h3>
                <p className="mt-3 text-ink-300">
                  Launch the dashboard, explore every module, and read the full architecture spec —
                  all inside the product.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/app">
                    <Button>
                      Enter dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/app/architecture">
                    <Button variant="outline">Read the spec</Button>
                  </Link>
                </div>
              </div>
              <div className="hidden justify-end lg:flex">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-neural-500/30 bg-gradient-to-br from-neural-500/20 to-cyber-500/20 animate-float-slow">
                  <Sparkles className="h-10 w-10 text-neural-300" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink-800/60 bg-ink-950/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="text-xs text-ink-500">
            © {new Date().getFullYear()} Developer Twin AI — architected by Chunduru Sai
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <a className="hover:text-ink-200" href="#features">Features</a>
            <a className="hover:text-ink-200" href="#security">Security</a>
            <Link className="hover:text-ink-200" to="/app/architecture">Architecture</Link>
            <span className="flex items-center gap-1 font-mono">
              <GitBranch className="h-3.5 w-3.5" />
              v1.0.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
