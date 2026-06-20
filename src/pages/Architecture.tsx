import { useState } from "react";
import {
  Layers,
  FolderTree,
  Database,
  Route,
  Lock,
  Workflow,
  TestTube2,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Card, CardBody, Badge } from "../components/ui";
import { PageShell } from "../components/Layout";
import { cn } from "../utils/cn";

type TabId =
  | "architecture"
  | "folders"
  | "schema"
  | "api"
  | "jwt"
  | "security"
  | "rag"
  | "testing";

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "architecture", label: "System Architecture", icon: Layers },
  { id: "folders", label: "Folder Structure", icon: FolderTree },
  { id: "schema", label: "Database Schema", icon: Database },
  { id: "api", label: "REST API Contract", icon: Route },
  { id: "jwt", label: "JWT Flow", icon: Lock },
  { id: "security", label: "Security Matrix", icon: Lock },
  { id: "rag", label: "RAG Pipeline", icon: Workflow },
  { id: "testing", label: "Testing & CI/CD", icon: TestTube2 },
];

export default function Architecture() {
  const [active, setActive] = useState<TabId>("architecture");
  const Tab = tabs.find((t) => t.id === active)!;

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
          // architecture & specification
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">
          Architecture & technical specification
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-ink-400">
          The production blueprint for Developer Twin AI — system design, folder layout, database
          schema, REST contract, JWT flow, security posture, RAG pipeline, and testing strategy.
          Architected by <span className="text-ink-200">Chunduru Sai</span>.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Tab list */}
        <Card className="h-fit">
          <CardBody className="p-2">
            <nav className="space-y-0.5">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                      isActive
                        ? "bg-gradient-to-r from-neural-500/15 to-transparent text-ink-50"
                        : "text-ink-300 hover:bg-ink-800/50 hover:text-ink-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-neural-300" : "text-ink-400",
                      )}
                    />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardBody>
        </Card>

        {/* Tab content */}
        <Card>
          <div className="flex items-center gap-3 border-b border-ink-800/60 px-5 py-4">
            <Tab.icon className="h-4 w-4 text-neural-300" />
            <h2 className="text-base font-semibold text-ink-50">{Tab.label}</h2>
          </div>
          <CardBody>
            {active === "architecture" && <ArchitectureSection />}
            {active === "folders" && <FoldersSection />}
            {active === "schema" && <SchemaSection />}
            {active === "api" && <ApiSection />}
            {active === "jwt" && <JwtSection />}
            {active === "security" && <SecuritySection />}
            {active === "rag" && <RagSection />}
            {active === "testing" && <TestingSection />}
          </CardBody>
        </Card>
      </div>
    </PageShell>
  );
}

/* ========================= ARCHITECTURE ========================= */

function ArchitectureSection() {
  return (
    <div className="space-y-8">
      <Principles />

      <section>
        <SectionTitle>High-level system diagram</SectionTitle>
        <div className="rounded-xl border border-ink-800 bg-ink-950/60 p-6">
          <svg viewBox="0 0 880 520" className="w-full">
            {/* Boxes */}
            <Box x={40} y={20} w={200} h={90} label="React SPA" sub="TypeScript · React Router · Tailwind" accent="#22d3ee" />
            <Box x={340} y={20} w={200} h={90} label="Nginx / CDN" sub="TLS termination · static assets" accent="#a78bfa" />
            <Box x={640} y={20} w={200} h={90} label="GitHub" sub="webhooks → ingestion queue" accent="#fbbf24" />

            <Box x={180} y={170} w={240} h={110} label="Spring Boot 3 API" sub="Java 21 · Spring Security · JWT" accent="#34d399" />
            <Box x={460} y={170} w={240} h={110} label="Worker Pool" sub="virtual threads · async ingestion" accent="#34d399" />

            <Box x={40} y={340} w={200} h={100} label="PostgreSQL" sub="primary · replicas · row security" accent="#22d3ee" />
            <Box x={260} y={340} w={200} h={100} label="ChromaDB" sub="vector embeddings · HNSW" accent="#22d3ee" />
            <Box x={480} y={340} w={200} h={100} label="Redis" sub="cache · refresh tokens · pubsub" accent="#22d3ee" />
            <Box x={700} y={340} w={160} h={100} label="Gemini API" sub="LLM + embeddings" accent="#fbbf24" />

            {/* Edges */}
            <Edge from={[140, 110]} to={[280, 170]} />
            <Edge from={[440, 110]} to={[440, 170]} />
            <Edge from={[740, 110]} to={[580, 170]} />
            <Edge from={[300, 280]} to={[140, 340]} />
            <Edge from={[340, 280]} to={[360, 340]} />
            <Edge from={[420, 280]} to={[580, 340]} />
            <Edge from={[580, 280]} to={[780, 340]} />
            <Edge from={[440, 225]} to={[460, 225]} dashed />
          </svg>
        </div>
      </section>

      <section>
        <SectionTitle>Cross-cutting concerns</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Observability", "OpenTelemetry traces to Jaeger, logs structured via Logback + MDC, metrics to Prometheus/Grafana."],
            ["Resilience", "Resilience4j for retries + circuit breakers on Gemini and GitHub clients. Timeout 5s / retry 3x exponential."],
            ["Scalability", "Stateless API pods, HPA on CPU & queue depth. ChromaDB sharded by tenant_id. Read replicas for analytics queries."],
            ["Data isolation", "Every entity scoped by tenant_id. Spring Data filters via @FilterDef. No cross-tenant joins."],
            ["Async ingestion", "Spring Integration channel from webhook → Chunker → Embedder → Chroma. Virtual threads (Java 21)."],
            ["Feature flags", "LaunchDarkly-compatible local provider. Gradual rollout of AI features per tenant."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg border border-ink-800 bg-ink-900/40 p-4">
              <div className="text-sm font-semibold text-ink-50">{t}</div>
              <div className="mt-1 text-xs leading-relaxed text-ink-400">{d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Principles() {
  const items = [
    "Clean architecture with strict layer boundaries (domain → application → infrastructure).",
    "SOLID throughout; DTOs never leak across layers, entities never reach controllers.",
    "Java 21 virtual threads for every I/O-bound call (Gemini, ChromaDB, GitHub, Postgres).",
    "Zero-trust default: every request authenticated, every input validated, every query parameterized.",
    "Async-first ingestion pipeline — user writes are never blocked by AI processing.",
    "Multi-tenant by tenant_id column + Spring Data filters; no shared schemas needed for MVP.",
  ];
  return (
    <section>
      <SectionTitle>Design principles</SectionTitle>
      <ul className="grid gap-2 md:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-3 rounded-lg border border-ink-800 bg-ink-900/40 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neural-300" />
            <span className="text-xs leading-relaxed text-ink-200">{i}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ========================= FOLDERS ========================= */

function FoldersSection() {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Backend (Spring Boot 3 · Maven)</SectionTitle>
        <pre className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-950/60 p-5 font-mono text-[12px] leading-relaxed text-ink-200">
{`developer-twin-api/
├── pom.xml
├── src/main/java/com/developertwin/
│   ├── DeveloperTwinApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── SwaggerConfig.java
│   │   ├── AsyncConfig.java
│   │   └── WebConfig.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtService.java
│   │   ├── UserDetailsServiceImpl.java
│   │   └── RefreshTokenCookieFilter.java
│   ├── domain/
│   │   ├── user/
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   ├── UserRepository.java
│   │   │   └── RefreshToken.java
│   │   ├── repository/
│   │   │   ├── Repository.java
│   │   │   └── RepositoryRepository.java
│   │   ├── commit/
│   │   │   ├── Commit.java
│   │   │   └── CommitRepository.java
│   │   ├── twin/
│   │   │   ├── DeveloperTwin.java
│   │   │   ├── Skill.java
│   │   │   └── DeveloperTwinRepository.java
│   │   └── knowledge/
│   │       ├── KnowledgeNode.java
│   │       ├── KnowledgeEdge.java
│   │       └── KnowledgeRepository.java
│   ├── application/
│   │   ├── dto/
│   │   │   ├── auth/ (LoginRequest, RegisterRequest, TokenResponse)
│   │   │   ├── repo/ (RepositoryDto, CommitDto)
│   │   │   ├── twin/ (TwinDto, SkillDto)
│   │   │   ├── chat/ (ChatRequest, ChatResponse, SourceDto)
│   │   │   └── common/ (PageResponse, ApiResponse<T>)
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── RepositoryService.java
│   │   │   ├── DeveloperTwinService.java
│   │   │   ├── ChatService.java
│   │   │   ├── KnowledgeMapService.java
│   │   │   ├── DocumentationService.java
│   │   │   └── RiskScoreService.java
│   │   └── port/ (driven ports for Gemini, Chroma, GitHub)
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   ├── GeminiClient.java
│   │   │   ├── GeminiEmbedder.java
│   │   │   └── GeminiReranker.java
│   │   ├── vector/
│   │   │   └── ChromaClient.java
│   │   ├── github/
│   │   │   ├── GitHubClient.java
│   │   │   └── WebhookHandler.java
│   │   └── ingestion/
│   │       ├── Chunker.java
│   │       ├── EmbeddingPipeline.java
│   │       └── IngestionListener.java
│   ├── web/
│   │   ├── v1/
│   │   │   ├── AuthController.java
│   │   │   ├── RepositoryController.java
│   │   │   ├── TwinController.java
│   │   │   ├── ChatController.java
│   │   │   ├── KnowledgeController.java
│   │   │   ├── DocumentationController.java
│   │   │   ├── AnalyticsController.java
│   │   │   └── SearchController.java
│   │   └── advice/
│   │       ├── GlobalExceptionHandler.java
│   │       └── ApiError.java
│   └── common/
│       ├── exception/ (BusinessException, NotFoundException, UnauthorizedException)
│       ├── audit/ (AuditAspect, AuditLog)
│       └── util/ (JsonUtil, DateUtil)
└── src/main/resources/
    ├── application.yml
    ├── application-dev.yml
    ├── application-prod.yml
    ├── db/migration/  (Flyway V1__..., V2__...)
    └── logback-spring.xml`}
        </pre>
      </section>

      <section>
        <SectionTitle>Frontend (React · TypeScript · Vite)</SectionTitle>
        <pre className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-950/60 p-5 font-mono text-[12px] leading-relaxed text-ink-200">
{`developer-twin-web/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── api/ (axios.ts, auth.ts, repos.ts, twins.ts, chat.ts)
│   │   ├── hooks/ (useAuth, useDebounce, useToast)
│   │   ├── types/ (generated from OpenAPI)
│   │   └── constants.ts
│   ├── store/ (zustand: authStore, uiStore, chatStore)
│   ├── context/ (ThemeContext, ToastContext)
│   ├── components/
│   │   ├── ui/ (Button, Card, Badge, Input, Modal, Toast)
│   │   ├── charts/ (Ring, Bars, Radar, Sparkline, Heatmap, KnowledgeGraph)
│   │   ├── layout/ (Sidebar, Topbar, Footer, ErrorBoundary)
│   │   └── auth/ (LoginForm, RegisterForm, ProtectedRoute)
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Repositories.tsx
│   │   ├── DeveloperTwin.tsx
│   │   ├── AskFormer.tsx
│   │   ├── KnowledgeMap.tsx
│   │   ├── RiskScore.tsx
│   │   ├── Analytics.tsx
│   │   ├── Search.tsx
│   │   ├── Documentation.tsx
│   │   ├── Architecture.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   └── utils/ (cn.ts, format.ts)
└── public/`}
        </pre>
      </section>
    </div>
  );
}

/* ========================= SCHEMA ========================= */

function SchemaSection() {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Entity-relationship diagram</SectionTitle>
        <div className="rounded-xl border border-ink-800 bg-ink-950/60 p-4">
          <svg viewBox="0 0 880 520" className="w-full">
            <Entity x={40} y={40} name="users" cols={["id PK uuid", "email UQ", "password_hash", "full_name", "role ENUM", "tenant_id FK", "created_at", "updated_at"]} accent="#34d399" />
            <Entity x={320} y={40} name="refresh_tokens" cols={["id PK uuid", "user_id FK", "token_hash UQ", "device_info", "expires_at", "revoked_at"]} accent="#34d399" />
            <Entity x={620} y={40} name="tenants" cols={["id PK uuid", "name", "plan", "created_at"]} accent="#34d399" />

            <Entity x={40} y={280} name="repositories" cols={["id PK uuid", "tenant_id FK", "github_id", "full_name", "language", "stars", "bus_factor", "risk ENUM", "knowledge_score", "last_ingested_at"]} accent="#22d3ee" />
            <Entity x={320} y={280} name="commits" cols={["id PK uuid", "repository_id FK", "sha", "author_email", "message", "authored_at", "files_touched", "embedding_id"]} accent="#22d3ee" />
            <Entity x={620} y={280} name="developer_twins" cols={["id PK uuid", "user_id FK NULL", "email", "display_name", "expertise_score", "avatar_url", "active BOOL", "coding_style JSONB", "skills JSONB", "languages JSONB"]} accent="#a78bfa" />

            <Entity x={40} y={460} name="knowledge_nodes" cols={["id PK uuid", "tenant_id FK", "label", "type ENUM", "risk FLOAT", "owner_count INT", "metadata JSONB"]} accent="#fbbf24" />
            <Entity x={360} y={460} name="knowledge_edges" cols={["id PK uuid", "from_node FK", "to_node FK", "weight INT"]} accent="#fbbf24" />
            <Entity x={660} y={460} name="documents" cols={["id PK uuid", "repository_id FK", "title", "content TEXT", "coverage INT", "generated_at"]} accent="#22d3ee" />

            <Rel from={[240, 80]} to={[320, 80]} />
            <Rel from={[240, 100]} to={[620, 80]} />
            <Rel from={[240, 340]} to={[320, 320]} />
            <Rel from={[520, 340]} to={[620, 320]} />
            <Rel from={[180, 420]} to={[180, 460]} />
            <Rel from={[240, 500]} to={[360, 500]} />
            <Rel from={[520, 420]} to={[660, 460]} />
          </svg>
        </div>
      </section>

      <section>
        <SectionTitle>DDL highlights (PostgreSQL 16)</SectionTitle>
        <pre className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-950/60 p-5 font-mono text-[12px] leading-relaxed text-ink-200">
{`-- Multi-tenant users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,           -- BCrypt, strength 12
  full_name     VARCHAR(255) NOT NULL,
  role          VARCHAR(32)  NOT NULL CHECK (role IN ('ADMIN','TEAM_LEAD','DEVELOPER')),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email  ON users(email);

-- Repositories scoped to tenant
CREATE TABLE repositories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  github_id         BIGINT NOT NULL,
  full_name         VARCHAR(255) NOT NULL,
  language          VARCHAR(64),
  stars             INTEGER DEFAULT 0,
  bus_factor        SMALLINT DEFAULT 0,
  risk              VARCHAR(16) NOT NULL CHECK (risk IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  knowledge_score   SMALLINT DEFAULT 0 CHECK (knowledge_score BETWEEN 0 AND 100),
  last_ingested_at  TIMESTAMPTZ,
  UNIQUE(tenant_id, github_id)
);

-- Commits (partitioned by repository_id hash for scale)
CREATE TABLE commits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id   UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  sha             CHAR(40) NOT NULL,
  author_email    VARCHAR(255) NOT NULL,
  message         TEXT NOT NULL,
  authored_at     TIMESTAMPTZ NOT NULL,
  files_touched   INTEGER DEFAULT 0,
  embedding_id    VARCHAR(64),                  -- points into ChromaDB
  UNIQUE(repository_id, sha)
);
CREATE INDEX idx_commits_repo_date ON commits(repository_id, authored_at DESC);

-- Row-level security: every read is filtered by current_setting('app.tenant_id')
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON repositories
  USING (tenant_id::text = current_setting('app.tenant_id'));

-- Audit log (append-only)
CREATE TABLE audit_log (
  id          BIGSERIAL PRIMARY KEY,
  actor_id    UUID NOT NULL,
  action      VARCHAR(64) NOT NULL,
  resource    VARCHAR(128) NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);`}
        </pre>
      </section>
    </div>
  );
}

/* ========================= API ========================= */

function ApiSection() {
  const groups: { title: string; endpoints: { method: string; path: string; roles: string; desc: string }[] }[] = [
    {
      title: "Authentication",
      endpoints: [
        { method: "POST", path: "/api/v1/auth/register", roles: "public", desc: "Register with email + password. Returns access + refresh tokens." },
        { method: "POST", path: "/api/v1/auth/login", roles: "public", desc: "Login. Sets refresh token as httpOnly cookie." },
        { method: "POST", path: "/api/v1/auth/refresh", roles: "public", desc: "Rotate refresh token, issue new access." },
        { method: "POST", path: "/api/v1/auth/logout", roles: "any", desc: "Revoke current refresh token." },
        { method: "GET",  path: "/api/v1/auth/me", roles: "any", desc: "Current user + roles." },
      ],
    },
    {
      title: "Repositories",
      endpoints: [
        { method: "GET",    path: "/api/v1/repositories", roles: "any", desc: "Paginated list; ?q, ?lang, ?sort, ?page." },
        { method: "POST",   path: "/api/v1/repositories/connect", roles: "ADMIN,TEAM_LEAD", desc: "Connect a GitHub repo by URL." },
        { method: "GET",    path: "/api/v1/repositories/{id}", roles: "any", desc: "Details + stats." },
        { method: "DELETE", path: "/api/v1/repositories/{id}", roles: "ADMIN", desc: "Disconnect and delete all ingested data." },
      ],
    },
    {
      title: "Developer Twins",
      endpoints: [
        { method: "GET", path: "/api/v1/twins", roles: "any", desc: "All twins in tenant." },
        { method: "GET", path: "/api/v1/twins/{id}", roles: "any", desc: "Skills radar, coding style, activity." },
      ],
    },
    {
      title: "Chat (Ask Former Employee)",
      endpoints: [
        { method: "POST", path: "/api/v1/chat/ask", roles: "any", desc: "RAG query. Returns answer + source commits." },
        { method: "GET",  path: "/api/v1/chat/history", roles: "any", desc: "Per-user chat history (paginated)." },
      ],
    },
    {
      title: "Knowledge Map & Risk",
      endpoints: [
        { method: "GET", path: "/api/v1/knowledge/graph", roles: "any", desc: "Nodes + edges for dependency graph." },
        { method: "GET", path: "/api/v1/knowledge/risk", roles: "any", desc: "Org-level risk score + component breakdown." },
        { method: "GET", path: "/api/v1/knowledge/insights", roles: "any", desc: "AI-ranked observations." },
      ],
    },
    {
      title: "Documentation & Search",
      endpoints: [
        { method: "GET",  path: "/api/v1/docs", roles: "any", desc: "List generated docs." },
        { method: "POST", path: "/api/v1/docs/{id}/regenerate", roles: "ADMIN,TEAM_LEAD", desc: "Force regeneration." },
        { method: "GET",  path: "/api/v1/search?q=", roles: "any", desc: "Hybrid vector + BM25 search. ?type, ?page." },
      ],
    },
    {
      title: "Analytics",
      endpoints: [
        { method: "GET", path: "/api/v1/analytics/summary", roles: "any", desc: "Top-level KPIs." },
        { method: "GET", path: "/api/v1/analytics/activity?range=", roles: "any", desc: "Commit/review/incident series." },
      ],
    },
  ];

  const methodColor: Record<string, string> = {
    GET: "text-cyber-300 bg-cyber-500/10 ring-cyber-500/30",
    POST: "text-neural-300 bg-neural-500/10 ring-neural-500/30",
    PUT: "text-amber-300 bg-amber-500/10 ring-amber-500/30",
    DELETE: "text-rose-300 bg-rose-500/10 ring-rose-500/30",
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-400">
        Versioned under <code className="font-mono text-ink-200">/api/v1</code>. All endpoints return{" "}
        <code className="font-mono text-ink-200">{`{ data: T, meta?, error? }`}</code>. Swagger UI at{" "}
        <code className="font-mono text-ink-200">/swagger-ui.html</code>.
      </p>

      {groups.map((g) => (
        <section key={g.title}>
          <SectionTitle>{g.title}</SectionTitle>
          <div className="overflow-hidden rounded-xl border border-ink-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-900/60 text-[11px] uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Method</th>
                  <th className="px-4 py-2.5 font-medium">Path</th>
                  <th className="px-4 py-2.5 font-medium">Roles</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/60 bg-ink-950/40">
                {g.endpoints.map((e, i) => (
                  <tr key={i} className="hover:bg-ink-900/40">
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ring-1 ${methodColor[e.method]}`}
                      >
                        {e.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-ink-100">{e.path}</td>
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-[11px] text-ink-300">{e.roles}</code>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-ink-400">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

/* ========================= JWT ========================= */

function JwtSection() {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Token architecture</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          <Spec label="Access token" rows={[["Lifetime", "15 minutes"], ["Storage", "JS memory"], ["Signature", "HS512, 256-bit secret"], ["Claims", "sub, roles, tenant_id, iat, exp"]]} />
          <Spec label="Refresh token" rows={[["Lifetime", "7 days"], ["Storage", "httpOnly Secure cookie"], ["Rotation", "Single-use; revoke on reuse"], ["Binding", "Device + user-agent"]]} />
          <Spec label="Revocation" rows={[["Strategy", "Refresh-token rotation + allowlist"], ["Logout", "Server-side revocation row"], ["Breach", "Global secret rotation (24h SLA)"], ["Audit", "Every issue/revoke logged"]]} />
        </div>
      </section>

      <section>
        <SectionTitle>Authentication flow</SectionTitle>
        <div className="rounded-xl border border-ink-800 bg-ink-950/60 p-4 font-mono text-[12px] leading-[1.8] text-ink-200">
          <div className="text-ink-500">Browser</div>
          <div className="pl-4">POST /api/v1/auth/login  {`{email, password}`}</div>
          <div className="pl-8 text-ink-500">→ Spring Security → BCrypt verify</div>
          <div className="pl-8 text-ink-500">→ JwtService.issue()</div>
          <div className="pl-8 text-ink-500">→ persist refresh_token row</div>
          <div className="pl-4">Set-Cookie: rt=***; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth</div>
          <div className="pl-4">{`{accessToken, user}`}</div>
          <div className="mt-4 text-ink-500">Subsequent request</div>
          <div className="pl-4">Authorization: Bearer &lt;access&gt;</div>
          <div className="pl-8 text-ink-500">→ JwtAuthenticationFilter validates signature + exp</div>
          <div className="pl-8 text-ink-500">→ SecurityContext populated with roles + tenant_id</div>
          <div className="mt-4 text-ink-500">On 401 (expired access)</div>
          <div className="pl-4">POST /api/v1/auth/refresh  (cookie rt auto-sent)</div>
          <div className="pl-8 text-ink-500">→ validate hash + not revoked + not expired</div>
          <div className="pl-8 text-ink-500">→ issue new access + rotate refresh (single-use)</div>
          <div className="pl-8 text-ink-500">→ on reuse detection: revoke entire family, alert</div>
        </div>
      </section>
    </div>
  );
}

/* ========================= SECURITY ========================= */

function SecuritySection() {
  const matrix: { threat: string; control: string; layer: string }[] = [
    { threat: "Credential stuffing", control: "BCrypt (strength 12) + rate-limit 5/min on /login", layer: "Auth" },
    { threat: "Session hijack", control: "Refresh token rotation, httpOnly cookie, SameSite=Lax", layer: "Auth" },
    { threat: "JWT tampering", control: "HS512 signature + strict exp validation", layer: "Auth" },
    { threat: "Broken access", control: "@PreAuthorize on every endpoint; tenant filter on every query", layer: "API" },
    { threat: "SQL injection", control: "Parameterized JPA queries; no string concat", layer: "Persistence" },
    { threat: "XSS", control: "Content-Security-Policy header + React escaping + DOMPurify for user content", layer: "Web" },
    { threat: "CSRF", control: "SameSite=Lax cookie + custom X-Requested-With for non-cookie auth", layer: "Web" },
    { threat: "Mass assignment", control: "Explicit DTOs with @Valid; no @RequestBody → entity", layer: "API" },
    { threat: "Secret leakage in commits", control: "Pre-ingestion secret scanner (truffleHog-lite); redact before embedding", layer: "Ingestion" },
    { threat: "Prompt injection", control: "System prompt + output schema validation; no tool-use on user content", layer: "AI" },
    { threat: "LLM hallucination", control: "Grounded answers only; every claim must cite a commit; rerank filters low-confidence", layer: "AI" },
    { threat: "Data exfiltration", control: "Row-level security; audit log on every search + chat query", layer: "Data" },
    { threat: "DoS on AI endpoints", control: "Token-bucket rate limit per tenant; 30 req/min on /chat/ask", layer: "API" },
    { threat: "Dependency compromise", control: "Dependabot + OWASP dependency-check in CI; signed commits", layer: "DevOps" },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900/60 text-[11px] uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">Threat</th>
              <th className="px-4 py-2.5 font-medium">Control</th>
              <th className="px-4 py-2.5 font-medium">Layer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/60 bg-ink-950/40">
            {matrix.map((m, i) => (
              <tr key={i} className="hover:bg-ink-900/40">
                <td className="px-4 py-2.5 font-medium text-ink-100">{m.threat}</td>
                <td className="px-4 py-2.5 text-xs text-ink-300">{m.control}</td>
                <td className="px-4 py-2.5">
                  <Badge tone="slate">{m.layer}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section>
        <SectionTitle>Headers served by the API</SectionTitle>
        <pre className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-950/60 p-5 font-mono text-[12px] leading-relaxed text-ink-200">
{`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cache-Control: no-store`}
        </pre>
      </section>
    </div>
  );
}

/* ========================= RAG ========================= */

function RagSection() {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Ingestion pipeline</SectionTitle>
        <div className="rounded-xl border border-ink-800 bg-ink-950/60 p-4">
          <svg viewBox="0 0 880 180" className="w-full">
            <Box x={20} y={60} w={140} h={60} label="GitHub" sub="webhook payload" accent="#fbbf24" />
            <Box x={180} y={60} w={140} h={60} label="Chunker" sub="AST-aware, 512 tokens" accent="#34d399" />
            <Box x={340} y={60} w={140} h={60} label="Secret scanner" sub="redact API keys" accent="#fb7185" />
            <Box x={500} y={60} w={140} h={60} label="Gemini embed" sub="text-embedding-004" accent="#34d399" />
            <Box x={660} y={60} w={140} h={60} label="ChromaDB" sub="tenant-scoped collection" accent="#22d3ee" />
            <Edge from={[160, 90]} to={[180, 90]} />
            <Edge from={[320, 90]} to={[340, 90]} />
            <Edge from={[480, 90]} to={[500, 90]} />
            <Edge from={[640, 90]} to={[660, 90]} />
          </svg>
        </div>
      </section>

      <section>
        <SectionTitle>Query pipeline</SectionTitle>
        <div className="rounded-xl border border-ink-800 bg-ink-950/60 p-4">
          <svg viewBox="0 0 880 180" className="w-full">
            <Box x={20} y={60} w={140} h={60} label="User query" sub="natural language" accent="#22d3ee" />
            <Box x={180} y={60} w={140} h={60} label="Hybrid search" sub="vector + BM25" accent="#34d399" />
            <Box x={340} y={60} w={140} h={60} label="Tenant filter" sub="RLS on collection" accent="#fb7185" />
            <Box x={500} y={60} w={140} h={60} label="Gemini rerank" sub="top-k → top-5" accent="#34d399" />
            <Box x={660} y={60} w={200} h={60} label="Answer + citations" sub="streamed, commit refs" accent="#22d3ee" />
            <Edge from={[160, 90]} to={[180, 90]} />
            <Edge from={[320, 90]} to={[340, 90]} />
            <Edge from={[480, 90]} to={[500, 90]} />
            <Edge from={[640, 90]} to={[660, 90]} />
          </svg>
        </div>
      </section>

      <section>
        <SectionTitle>Guardrails</SectionTitle>
        <ul className="grid gap-2 md:grid-cols-2">
          {[
            "Every answer must cite ≥ 1 commit; otherwise fall back to 'insufficient context'.",
            "PII / secret redaction runs before embedding and again before generation.",
            "Hallucination filter: reranker drops passages with score < 0.6.",
            "Per-tenant ChromaDB collection; no cross-tenant search possible.",
            "Rate limit: 30 /chat/ask requests per minute per tenant.",
            "Audit log: every query, sources returned, and latency are persisted.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-ink-800 bg-ink-900/40 p-3 text-xs text-ink-200">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neural-300" />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ========================= TESTING ========================= */

function TestingSection() {
  const unit = [
    "JwtService: sign, verify, expired, malformed signature, tampered payload.",
    "AuthService: register (valid, duplicate email, weak password), login (valid, wrong password, disabled user).",
    "RiskScoreService: weighted composite formula, edge cases (all zeros, missing factor).",
    "DeveloperTwinService: skill aggregation from commits, null commits, empty skills.",
    "Chunker: AST-aware splitting, empty file, file > max size, binary file rejected.",
  ];
  const integration = [
    "PostgreSQL via Testcontainers: repository CRUD, tenant isolation, Flyway migrations.",
    "ChromaDB via Testcontainers: upsert, query, tenant-scoped collection.",
    "Spring MVC: every controller returns 200/201/400/401/403/404 with correct shape.",
    "Webhook ingestion: signed GitHub payload → 202 → commit row + embedding id.",
  ];
  const api = [
    "POST /auth/register with valid body → 201 + tokens.",
    "POST /auth/register with duplicate email → 409.",
    "GET /repositories without auth → 401.",
    "GET /repositories as DEVELOPER → only tenant-scoped results.",
    "POST /chat/ask with valid query → 200 + answer + sources.",
    "POST /chat/ask rate-limited → 429.",
  ];
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Unit tests (JUnit 5 + Mockito)</SectionTitle>
        <ul className="space-y-2">
          {unit.map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-ink-800 bg-ink-900/40 p-3 text-xs text-ink-200">
              <Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neural-300" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Integration tests (Spring Boot Test + Testcontainers)</SectionTitle>
        <ul className="space-y-2">
          {integration.map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-ink-800 bg-ink-900/40 p-3 text-xs text-ink-200">
              <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyber-300" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>API contract tests (MockMvc + JSONPath)</SectionTitle>
        <ul className="space-y-2">
          {api.map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-ink-800 bg-ink-900/40 p-3 text-xs text-ink-200">
              <Route className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>CI/CD pipeline</SectionTitle>
        <pre className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-950/60 p-5 font-mono text-[12px] leading-relaxed text-ink-200">
{`# .github/workflows/ci.yml (simplified)
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:16 }
      chroma:   { image: chromadb/chroma:latest }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 21 }
      - run: ./mvnw -B verify
      - run: ./mvnw -B jacoco:report
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: target/site/jacoco }
      - run: |
          cd web
          npm ci
          npm run lint
          npm run typecheck
          npm run build
          npm test`}
        </pre>
      </section>
    </div>
  );
}

/* ========================= helpers ========================= */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold tracking-tight text-ink-50">{children}</h3>;
}

function Spec({ label, rows }: { label: string; rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
      <div className="font-mono text-[11px] uppercase tracking-wider text-neural-300">{label}</div>
      <dl className="mt-3 space-y-2 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-3">
            <dt className="text-ink-400">{k}</dt>
            <dd className="text-right font-mono text-ink-100">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#121624" stroke={accent} strokeWidth={1.5} />
      <rect x={x} y={y} width={w} height={24} rx={10} fill={accent} opacity={0.12} />
      <text x={x + 12} y={y + 16} fontSize={12} fontWeight={600} fill={accent}>
        {label}
      </text>
      {sub ? (
        <text x={x + 12} y={y + 50} fontSize={10} fill="#b2b9c6">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Edge({ from, to, dashed }: { from: [number, number]; to: [number, number]; dashed?: boolean }) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="#4b5368"
      strokeWidth={1.5}
      strokeDasharray={dashed ? "4 4" : undefined}
    />
  );
}

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
  const h = 32 + cols.length * 18;
  return (
    <g>
      <rect x={x} y={y} width={220} height={h} rx={8} fill="#121624" stroke={accent} strokeWidth={1.5} />
      <rect x={x} y={y} width={220} height={28} rx={8} fill={accent} opacity={0.15} />
      <text x={x + 10} y={y + 18} fontSize={12} fontWeight={700} fill={accent}>
        {name}
      </text>
      {cols.map((c, i) => (
        <text key={i} x={x + 10} y={y + 46 + i * 18} fontSize={10} fill="#d6dae2" fontFamily="monospace">
          {c}
        </text>
      ))}
    </g>
  );
}

function Rel({ from, to }: { from: [number, number]; to: [number, number] }) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="#656e82"
      strokeWidth={1.2}
      strokeDasharray="3 3"
    />
  );
}
