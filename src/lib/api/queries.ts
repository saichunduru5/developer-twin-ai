import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import {
  repositories,
  team,
  docs,
  searchResults,
  knowledgeHealth,
  currentUser,
} from "../data";
import type { Developer, Repository, DocEntry, SearchResult } from "../types";

/* ---------------- Network simulation ---------------- */

const jitter = (ms: number) => ms + Math.random() * 150;

async function fakeNetwork<T>(value: T, ms = 400): Promise<T> {
  await new Promise((r) => window.setTimeout(r, jitter(ms)));
  // Simulate occasional 0% failure if needed: disabled for stability.
  return value;
}

/* ---------------- Query keys (centralized) ---------------- */

export const queryKeys = {
  all: ["dtai"] as const,
  repos: () => [...queryKeys.all, "repositories"] as const,
  repo: (id: string) => [...queryKeys.repos(), id] as const,
  twins: () => [...queryKeys.all, "twins"] as const,
  twin: (id: string) => [...queryKeys.twins(), id] as const,
  docs: () => [...queryKeys.all, "docs"] as const,
  health: () => [...queryKeys.all, "health"] as const,
  search: (q: string, type: string) => [...queryKeys.all, "search", q, type] as const,
  profile: () => [...queryKeys.all, "profile"] as const,
  settings: () => [...queryKeys.all, "settings"] as const,
  schema: () => [...queryKeys.all, "schema"] as const,
};

/* ---------------- Repositories ---------------- */

export function useRepositories(): UseQueryResult<Repository[], Error> {
  return useQuery<Repository[], Error>({
    queryKey: queryKeys.repos(),
    queryFn: () => fakeNetwork(repositories, 600),
  });
}

export function useRepository(id: string): UseQueryResult<Repository | undefined, Error> {
  return useQuery<Repository | undefined, Error>({
    queryKey: queryKeys.repo(id),
    queryFn: () => fakeNetwork(repositories.find((r) => r.id === id), 400),
    enabled: Boolean(id),
  });
}

/* ---------------- Twins ---------------- */

export function useTwins(): UseQueryResult<Developer[], Error> {
  return useQuery<Developer[], Error>({
    queryKey: queryKeys.twins(),
    queryFn: () => fakeNetwork(team, 500),
  });
}

export function useTwin(id: string): UseQueryResult<Developer | undefined, Error> {
  return useQuery<Developer | undefined, Error>({
    queryKey: queryKeys.twin(id),
    queryFn: () => fakeNetwork(team.find((t) => t.id === id), 350),
    enabled: Boolean(id),
  });
}

/* ---------------- Documentation ---------------- */

export function useDocs(): UseQueryResult<DocEntry[], Error> {
  return useQuery<DocEntry[], Error>({
    queryKey: queryKeys.docs(),
    queryFn: () => fakeNetwork(docs, 450),
  });
}

export function useRegenerateDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fakeNetwork(null, 800);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.docs() });
    },
  });
}

/* ---------------- Health ---------------- */

export function useKnowledgeHealth() {
  return useQuery({
    queryKey: queryKeys.health(),
    queryFn: () => fakeNetwork(knowledgeHealth, 350),
  });
}

/* ---------------- Search ---------------- */

export function useSearch(q: string, type: SearchResult["type"] | "all") {
  return useQuery<SearchResult[], Error>({
    queryKey: queryKeys.search(q, type),
    queryFn: async () => {
      await fakeNetwork(null, 300);
      const lower = q.trim().toLowerCase();
      return searchResults
        .filter((r) => (type === "all" ? true : r.type === type))
        .filter((r) =>
          lower === ""
            ? true
            : (r.title + r.snippet + r.source + r.author).toLowerCase().includes(lower),
        );
    },
  });
}

/* ---------------- Profile ---------------- */

export interface ProfileSettings {
  name: string;
  handle: string;
  email: string;
  bio: string;
  timezone: string;
  language: string;
}

export function useProfile() {
  return useQuery<ProfileSettings, Error>({
    queryKey: queryKeys.profile(),
    queryFn: async () => {
      await fakeNetwork(null, 450);
      return {
        name: currentUser.name,
        handle: currentUser.handle,
        email: "sai@developertwin.ai",
        bio: "Principal engineer building Developer Twin AI. Passionate about preserving engineering knowledge.",
        timezone: "Asia/Kolkata",
        language: "en-US",
      };
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<ProfileSettings>) => {
      await fakeNetwork(null, 600);
      return patch;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile() }),
  });
}

/* ---------------- Settings ---------------- */

export interface AppSettings {
  appearance: "dark" | "light" | "system";
  density: "comfortable" | "compact";
  emailNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  sessionTimeoutMin: number;
  apiKeys: { name: string; prefix: string; createdAt: string }[];
}

export function useAppSettings() {
  return useQuery<AppSettings, Error>({
    queryKey: queryKeys.settings(),
    queryFn: async () => {
      await fakeNetwork(null, 450);
      return {
        appearance: "dark",
        density: "comfortable",
        emailNotifications: true,
        weeklyDigest: true,
        marketingEmails: false,
        twoFactorEnabled: true,
        sessionTimeoutMin: 30,
        apiKeys: [
          { name: "Production", prefix: "dtp_prod_8f2c…a412", createdAt: "2025-09-12" },
          { name: "Staging", prefix: "dtp_stg_31b9…fe02", createdAt: "2025-10-04" },
        ],
      };
    },
  });
}

export function useUpdateAppSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<AppSettings>) => {
      await fakeNetwork(null, 700);
      return patch;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.settings() }),
  });
}

/* ---------------- Database schema (for the Database page) ---------------- */

export interface TableInfo {
  name: string;
  purpose: string;
  rowsEstimate: string;
  softDelete: boolean;
  optimisticLock: boolean;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    pk?: boolean;
    fk?: string;
    uq?: boolean;
    indexed?: boolean;
    audit?: boolean;
    default?: string;
  }[];
}

export function useDatabaseSchema() {
  return useQuery({
    queryKey: queryKeys.schema(),
    queryFn: async () => {
      await fakeNetwork(null, 500);
      return SCHEMA;
    },
  });
}

/* ---- Canonical schema: UUID v7 PKs, audit fields, soft-delete, optimistic lock ---- */

export const SCHEMA: {
  tables: TableInfo[];
  migrations: { version: string; name: string; sql: string }[];
  relationships: { from: string; to: string; type: string; onDelete: string }[];
  indexes: { table: string; name: string; columns: string; kind: string; purpose: string }[];
  softDeleteStrategy: string[];
  optimisticLockStrategy: string[];
  auditStrategy: string[];
} = {
  tables: [
    {
      name: "tenants",
      purpose: "Organizations (multi-tenant boundary)",
      rowsEstimate: "~1k",
      softDelete: true,
      optimisticLock: true,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "name", type: "VARCHAR(255)", nullable: false },
        { name: "slug", type: "VARCHAR(64)", nullable: false, uq: true, indexed: true },
        { name: "plan", type: "VARCHAR(32)", nullable: false, default: "'free'" },
        { name: "settings", type: "JSONB", nullable: false, default: "'{}'::jsonb" },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "created_by", type: "UUID", nullable: true, audit: true },
        { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "updated_by", type: "UUID", nullable: true, audit: true },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "version", type: "INTEGER", nullable: false, default: "0" },
      ],
    },
    {
      name: "users",
      purpose: "Human users; owns credentials + roles",
      rowsEstimate: "~50k",
      softDelete: true,
      optimisticLock: true,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "email", type: "VARCHAR(255)", nullable: false, uq: true, indexed: true },
        { name: "password_hash", type: "VARCHAR(255)", nullable: false },
        { name: "full_name", type: "VARCHAR(255)", nullable: false },
        { name: "role", type: "VARCHAR(32)", nullable: false, default: "'DEVELOPER'" },
        { name: "avatar_url", type: "VARCHAR(512)", nullable: true },
        { name: "last_login_at", type: "TIMESTAMPTZ", nullable: true, indexed: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "created_by", type: "UUID", nullable: true, audit: true },
        { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "updated_by", type: "UUID", nullable: true, audit: true },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "version", type: "INTEGER", nullable: false, default: "0" },
      ],
    },
    {
      name: "refresh_tokens",
      purpose: "Single-use refresh tokens (rotation + family revocation)",
      rowsEstimate: "~500k",
      softDelete: false,
      optimisticLock: false,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "user_id", type: "UUID", nullable: false, fk: "users.id", indexed: true },
        { name: "token_hash", type: "VARCHAR(128)", nullable: false, uq: true, indexed: true },
        { name: "family_id", type: "UUID", nullable: false, indexed: true },
        { name: "device_info", type: "VARCHAR(255)", nullable: true },
        { name: "ip_address", type: "INET", nullable: true },
        { name: "expires_at", type: "TIMESTAMPTZ", nullable: false, indexed: true },
        { name: "revoked_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
      ],
    },
    {
      name: "repositories",
      purpose: "Connected GitHub repos (tenant-scoped)",
      rowsEstimate: "~20k",
      softDelete: true,
      optimisticLock: true,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "github_id", type: "BIGINT", nullable: false },
        { name: "full_name", type: "VARCHAR(255)", nullable: false, indexed: true },
        { name: "language", type: "VARCHAR(64)", nullable: true, indexed: true },
        { name: "stars", type: "INTEGER", nullable: false, default: "0" },
        { name: "bus_factor", type: "SMALLINT", nullable: false, default: "0" },
        { name: "risk", type: "VARCHAR(16)", nullable: false },
        { name: "knowledge_score", type: "SMALLINT", nullable: false, default: "0" },
        { name: "last_ingested_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "created_by", type: "UUID", nullable: true, audit: true },
        { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "updated_by", type: "UUID", nullable: true, audit: true },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "version", type: "INTEGER", nullable: false, default: "0" },
      ],
    },
    {
      name: "commits",
      purpose: "Immutable commit snapshots (append-only)",
      rowsEstimate: "~10M",
      softDelete: false,
      optimisticLock: false,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "repository_id", type: "UUID", nullable: false, fk: "repositories.id", indexed: true },
        { name: "sha", type: "CHAR(40)", nullable: false, indexed: true },
        { name: "author_email", type: "VARCHAR(255)", nullable: false, indexed: true },
        { name: "message", type: "TEXT", nullable: false },
        { name: "authored_at", type: "TIMESTAMPTZ", nullable: false, indexed: true },
        { name: "files_touched", type: "INTEGER", nullable: false, default: "0" },
        { name: "embedding_id", type: "VARCHAR(64)", nullable: true },
      ],
    },
    {
      name: "developer_twins",
      purpose: "AI-generated twin profiles (live + archived)",
      rowsEstimate: "~50k",
      softDelete: true,
      optimisticLock: true,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "user_id", type: "UUID", nullable: true, fk: "users.id", indexed: true },
        { name: "email", type: "VARCHAR(255)", nullable: false, indexed: true },
        { name: "display_name", type: "VARCHAR(255)", nullable: false },
        { name: "expertise_score", type: "SMALLINT", nullable: false, default: "0" },
        { name: "avatar_url", type: "VARCHAR(512)", nullable: true },
        { name: "active", type: "BOOLEAN", nullable: false, default: "true", indexed: true },
        { name: "coding_style", type: "JSONB", nullable: false, default: "'{}'::jsonb" },
        { name: "skills", type: "JSONB", nullable: false, default: "'[]'::jsonb" },
        { name: "languages", type: "JSONB", nullable: false, default: "'[]'::jsonb" },
        { name: "last_computed_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "created_by", type: "UUID", nullable: true, audit: true },
        { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "updated_by", type: "UUID", nullable: true, audit: true },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "version", type: "INTEGER", nullable: false, default: "0" },
      ],
    },
    {
      name: "knowledge_nodes",
      purpose: "Services, DBs, queues in the dependency graph",
      rowsEstimate: "~5k",
      softDelete: true,
      optimisticLock: true,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "label", type: "VARCHAR(255)", nullable: false },
        { name: "type", type: "VARCHAR(32)", nullable: false, indexed: true },
        { name: "risk", type: "REAL", nullable: false, default: "0" },
        { name: "owner_count", type: "SMALLINT", nullable: false, default: "0" },
        { name: "metadata", type: "JSONB", nullable: false, default: "'{}'::jsonb" },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "created_by", type: "UUID", nullable: true, audit: true },
        { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "updated_by", type: "UUID", nullable: true, audit: true },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "version", type: "INTEGER", nullable: false, default: "0" },
      ],
    },
    {
      name: "knowledge_edges",
      purpose: "Directed edges in the dependency graph",
      rowsEstimate: "~20k",
      softDelete: true,
      optimisticLock: false,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "from_node_id", type: "UUID", nullable: false, fk: "knowledge_nodes.id", indexed: true },
        { name: "to_node_id", type: "UUID", nullable: false, fk: "knowledge_nodes.id", indexed: true },
        { name: "weight", type: "SMALLINT", nullable: false, default: "1" },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
      ],
    },
    {
      name: "documents",
      purpose: "Auto-generated module documentation",
      rowsEstimate: "~100k",
      softDelete: true,
      optimisticLock: true,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "repository_id", type: "UUID", nullable: false, fk: "repositories.id", indexed: true },
        { name: "title", type: "VARCHAR(512)", nullable: false },
        { name: "content", type: "TEXT", nullable: false },
        { name: "coverage", type: "SMALLINT", nullable: false, default: "0" },
        { name: "generated_at", type: "TIMESTAMPTZ", nullable: false, indexed: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "created_by", type: "UUID", nullable: true, audit: true },
        { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()" },
        { name: "updated_by", type: "UUID", nullable: true, audit: true },
        { name: "deleted_at", type: "TIMESTAMPTZ", nullable: true },
        { name: "version", type: "INTEGER", nullable: false, default: "0" },
      ],
    },
    {
      name: "chat_messages",
      purpose: "Ask-Former-Employee chat history (per user)",
      rowsEstimate: "~1M",
      softDelete: false,
      optimisticLock: false,
      columns: [
        { name: "id", type: "UUID", nullable: false, pk: true, default: "gen_random_uuid()" },
        { name: "tenant_id", type: "UUID", nullable: false, fk: "tenants.id", indexed: true },
        { name: "user_id", type: "UUID", nullable: false, fk: "users.id", indexed: true },
        { name: "role", type: "VARCHAR(16)", nullable: false },
        { name: "content", type: "TEXT", nullable: false },
        { name: "sources", type: "JSONB", nullable: false, default: "'[]'::jsonb" },
        { name: "latency_ms", type: "INTEGER", nullable: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()", indexed: true },
      ],
    },
    {
      name: "audit_log",
      purpose: "Append-only compliance log (never soft-deleted)",
      rowsEstimate: "~100M",
      softDelete: false,
      optimisticLock: false,
      columns: [
        { name: "id", type: "BIGSERIAL", nullable: false, pk: true },
        { name: "tenant_id", type: "UUID", nullable: false, indexed: true },
        { name: "actor_id", type: "UUID", nullable: false, indexed: true },
        { name: "action", type: "VARCHAR(64)", nullable: false, indexed: true },
        { name: "resource", type: "VARCHAR(128)", nullable: false },
        { name: "resource_id", type: "UUID", nullable: true, indexed: true },
        { name: "metadata", type: "JSONB", nullable: false, default: "'{}'::jsonb" },
        { name: "ip_address", type: "INET", nullable: true },
        { name: "created_at", type: "TIMESTAMPTZ", nullable: false, audit: true, default: "now()", indexed: true },
      ],
    },
  ],

  relationships: [
    { from: "users", to: "tenants", type: "N:1", onDelete: "CASCADE" },
    { from: "refresh_tokens", to: "users", type: "N:1", onDelete: "CASCADE" },
    { from: "repositories", to: "tenants", type: "N:1", onDelete: "CASCADE" },
    { from: "commits", to: "repositories", type: "N:1", onDelete: "CASCADE" },
    { from: "developer_twins", to: "tenants", type: "N:1", onDelete: "CASCADE" },
    { from: "developer_twins", to: "users", type: "N:1 (nullable)", onDelete: "SET NULL" },
    { from: "knowledge_nodes", to: "tenants", type: "N:1", onDelete: "CASCADE" },
    { from: "knowledge_edges", to: "knowledge_nodes", type: "N:1 (from)", onDelete: "CASCADE" },
    { from: "knowledge_edges", to: "knowledge_nodes", type: "N:1 (to)", onDelete: "CASCADE" },
    { from: "documents", to: "repositories", type: "N:1", onDelete: "CASCADE" },
    { from: "chat_messages", to: "users", type: "N:1", onDelete: "CASCADE" },
  ],

  indexes: [
    { table: "users", name: "users_tenant_email_idx", columns: "(tenant_id, email)", kind: "B-tree UNIQUE", purpose: "Login + tenant isolation" },
    { table: "users", name: "users_active_idx", columns: "(tenant_id) WHERE deleted_at IS NULL", kind: "Partial", purpose: "Skip soft-deleted users" },
    { table: "refresh_tokens", name: "rt_token_hash_uq", columns: "(token_hash)", kind: "B-tree UNIQUE", purpose: "O(1) lookup on refresh" },
    { table: "refresh_tokens", name: "rt_expires_idx", columns: "(expires_at)", kind: "B-tree", purpose: "TTL cleanup job" },
    { table: "refresh_tokens", name: "rt_family_idx", columns: "(family_id)", kind: "B-tree", purpose: "Family revocation" },
    { table: "repositories", name: "repos_tenant_github_uq", columns: "(tenant_id, github_id)", kind: "B-tree UNIQUE", purpose: "No duplicate connects" },
    { table: "repositories", name: "repos_active_idx", columns: "(tenant_id) WHERE deleted_at IS NULL", kind: "Partial", purpose: "Skip deleted repos" },
    { table: "commits", name: "commits_repo_sha_uq", columns: "(repository_id, sha)", kind: "B-tree UNIQUE", purpose: "Idempotent ingestion" },
    { table: "commits", name: "commits_repo_date_idx", columns: "(repository_id, authored_at DESC)", kind: "B-tree", purpose: "Timeline queries" },
    { table: "commits", name: "commits_author_idx", columns: "(author_email, authored_at DESC)", kind: "B-tree", purpose: "Twin computation" },
    { table: "developer_twins", name: "twins_tenant_email_idx", columns: "(tenant_id, email)", kind: "B-tree UNIQUE", purpose: "One twin per email per tenant" },
    { table: "developer_twins", name: "twins_active_idx", columns: "(tenant_id, active) WHERE deleted_at IS NULL", kind: "Partial composite", purpose: "List active twins fast" },
    { table: "knowledge_edges", name: "edges_from_idx", columns: "(from_node_id)", kind: "B-tree", purpose: "Graph traversal" },
    { table: "knowledge_edges", name: "edges_to_idx", columns: "(to_node_id)", kind: "B-tree", purpose: "Reverse traversal" },
    { table: "documents", name: "docs_repo_generated_idx", columns: "(repository_id, generated_at DESC)", kind: "B-tree", purpose: "Latest doc per repo" },
    { table: "chat_messages", name: "chat_user_created_idx", columns: "(user_id, created_at DESC)", kind: "B-tree", purpose: "Chat history pagination" },
    { table: "audit_log", name: "audit_tenant_created_idx", columns: "(tenant_id, created_at DESC)", kind: "B-tree", purpose: "Compliance pagination" },
  ],

  softDeleteStrategy: [
    "Column: deleted_at TIMESTAMPTZ NULL. NULL = active.",
    "Every read adds WHERE deleted_at IS NULL — enforced in JPA via @Where(clause = \"deleted_at IS NULL\").",
    "Delete operations become UPDATE … SET deleted_at = now(), updated_by = :currentUser.",
    "UNIQUE constraints become PARTIAL: CREATE UNIQUE INDEX … WHERE deleted_at IS NULL — so a re-activated slug stays unique.",
    "Hard delete only via admin cron (older than 2 years) with audit trail.",
    "Children of soft-deleted parents are soft-deleted in the same transaction.",
    "Never expose deleted rows through the public API without an explicit ?include_deleted=true flag (ADMIN only).",
  ],

  optimisticLockStrategy: [
    "Column: version INTEGER NOT NULL DEFAULT 0 on every user-editable entity.",
    "JPA @Version annotation — Hibernate auto-increments on UPDATE and adds WHERE version = :old.",
    "Stale update → OptimisticLockException → mapped to HTTP 409 Conflict by GlobalExceptionHandler.",
    "Client must send If-Match: <version> header on PUT/PATCH; server rejects otherwise.",
    "Read-heavy entities (repositories, twins, documents) carry @Version; append-only tables (commits, audit_log) do not.",
  ],

  auditStrategy: [
    "Four standard columns: created_at, created_by, updated_at, updated_by.",
    "Populated by a JPA @MappedSuperclass Auditable + @EntityListeners(AuditingEntityListener.class).",
    "Current actor resolved from Spring Security via AuditorAware<UUID> bean.",
    "updated_at updated via @PreUpdate with now().",
    "Sensitive mutations (role change, password reset, delete) also insert a row into audit_log.",
    "audit_log is partitioned by month (PARTITION BY RANGE on created_at) for retention.",
  ],

  migrations: [
    {
      version: "V1",
      name: "init_tenants_users",
      sql: `-- Flyway V1__init_tenants_users.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(64)  NOT NULL,
  plan        VARCHAR(32)  NOT NULL DEFAULT 'free',
  settings    JSONB        NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by  UUID,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by  UUID,
  deleted_at  TIMESTAMPTZ,
  version     INTEGER      NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX tenants_slug_uq ON tenants(slug) WHERE deleted_at IS NULL;

CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email          VARCHAR(255) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  full_name      VARCHAR(255) NOT NULL,
  role           VARCHAR(32)  NOT NULL DEFAULT 'DEVELOPER'
                 CHECK (role IN ('ADMIN','TEAM_LEAD','DEVELOPER')),
  avatar_url     VARCHAR(512),
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by     UUID,
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by     UUID,
  deleted_at     TIMESTAMPTZ,
  version        INTEGER      NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX users_email_uq ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX users_tenant_idx ON users(tenant_id);
CREATE INDEX users_last_login_idx ON users(last_login_at DESC);`,
    },
    {
      version: "V2",
      name: "refresh_tokens",
      sql: `-- Flyway V2__refresh_tokens.sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(128) NOT NULL,
  family_id   UUID         NOT NULL,
  device_info VARCHAR(255),
  ip_address  INET,
  expires_at  TIMESTAMPTZ  NOT NULL,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX rt_token_hash_uq ON refresh_tokens(token_hash);
CREATE INDEX rt_user_idx    ON refresh_tokens(user_id);
CREATE INDEX rt_family_idx  ON refresh_tokens(family_id);
CREATE INDEX rt_expires_idx ON refresh_tokens(expires_at);`,
    },
    {
      version: "V3",
      name: "repositories_commits",
      sql: `-- Flyway V3__repositories_commits.sql
CREATE TABLE repositories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  github_id         BIGINT       NOT NULL,
  full_name         VARCHAR(255) NOT NULL,
  language          VARCHAR(64),
  stars             INTEGER      NOT NULL DEFAULT 0,
  bus_factor        SMALLINT     NOT NULL DEFAULT 0,
  risk              VARCHAR(16)  NOT NULL CHECK (risk IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  knowledge_score   SMALLINT     NOT NULL DEFAULT 0 CHECK (knowledge_score BETWEEN 0 AND 100),
  last_ingested_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by        UUID,
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by        UUID,
  deleted_at        TIMESTAMPTZ,
  version           INTEGER      NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, github_id)
);
CREATE INDEX repos_tenant_idx ON repositories(tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE commits (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id  UUID         NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  sha            CHAR(40)     NOT NULL,
  author_email   VARCHAR(255) NOT NULL,
  message        TEXT         NOT NULL,
  authored_at    TIMESTAMPTZ  NOT NULL,
  files_touched  INTEGER      NOT NULL DEFAULT 0,
  embedding_id   VARCHAR(64),
  UNIQUE (repository_id, sha)
);
CREATE INDEX commits_repo_date_idx ON commits(repository_id, authored_at DESC);
CREATE INDEX commits_author_idx    ON commits(author_email, authored_at DESC);`,
    },
    {
      version: "V4",
      name: "developer_twins",
      sql: `-- Flyway V4__developer_twins.sql
CREATE TABLE developer_twins (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id          UUID         REFERENCES users(id) ON DELETE SET NULL,
  email            VARCHAR(255) NOT NULL,
  display_name     VARCHAR(255) NOT NULL,
  expertise_score  SMALLINT     NOT NULL DEFAULT 0,
  avatar_url       VARCHAR(512),
  active           BOOLEAN      NOT NULL DEFAULT TRUE,
  coding_style     JSONB        NOT NULL DEFAULT '{}'::jsonb,
  skills           JSONB        NOT NULL DEFAULT '[]'::jsonb,
  languages        JSONB        NOT NULL DEFAULT '[]'::jsonb,
  last_computed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by       UUID,
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by       UUID,
  deleted_at       TIMESTAMPTZ,
  version          INTEGER      NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX twins_email_uq ON developer_twins(tenant_id, email) WHERE deleted_at IS NULL;
CREATE INDEX twins_active_idx ON developer_twins(tenant_id, active) WHERE deleted_at IS NULL;`,
    },
    {
      version: "V5",
      name: "knowledge_graph",
      sql: `-- Flyway V5__knowledge_graph.sql
CREATE TABLE knowledge_nodes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  label       VARCHAR(255) NOT NULL,
  type        VARCHAR(32)  NOT NULL CHECK (type IN ('service','db','queue','api','lib')),
  risk        REAL         NOT NULL DEFAULT 0 CHECK (risk BETWEEN 0 AND 1),
  owner_count SMALLINT     NOT NULL DEFAULT 0,
  metadata    JSONB        NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by  UUID,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by  UUID,
  deleted_at  TIMESTAMPTZ,
  version     INTEGER      NOT NULL DEFAULT 0
);
CREATE INDEX knodes_tenant_idx ON knowledge_nodes(tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE knowledge_edges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID     NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  from_node_id UUID     NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  to_node_id   UUID     NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  weight       SMALLINT NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ
);
CREATE INDEX kedges_from_idx ON knowledge_edges(from_node_id) WHERE deleted_at IS NULL;
CREATE INDEX kedges_to_idx   ON knowledge_edges(to_node_id)   WHERE deleted_at IS NULL;`,
    },
    {
      version: "V6",
      name: "documents_chat_audit",
      sql: `-- Flyway V6__documents_chat_audit.sql
CREATE TABLE documents (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  repository_id  UUID         NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  title          VARCHAR(512) NOT NULL,
  content        TEXT         NOT NULL,
  coverage       SMALLINT     NOT NULL DEFAULT 0,
  generated_at   TIMESTAMPTZ  NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by     UUID,
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by     UUID,
  deleted_at     TIMESTAMPTZ,
  version        INTEGER      NOT NULL DEFAULT 0
);
CREATE INDEX docs_repo_generated_idx ON documents(repository_id, generated_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(16)  NOT NULL CHECK (role IN ('user','assistant')),
  content     TEXT         NOT NULL,
  sources     JSONB        NOT NULL DEFAULT '[]'::jsonb,
  latency_ms  INTEGER,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX chat_user_created_idx ON chat_messages(user_id, created_at DESC);

CREATE TABLE audit_log (
  id           BIGSERIAL PRIMARY KEY,
  tenant_id    UUID         NOT NULL,
  actor_id     UUID         NOT NULL,
  action       VARCHAR(64)  NOT NULL,
  resource     VARCHAR(128) NOT NULL,
  resource_id  UUID,
  metadata     JSONB        NOT NULL DEFAULT '{}'::jsonb,
  ip_address   INET,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);
-- Partition creation handled by a monthly cron / pg_partman extension.
CREATE INDEX audit_tenant_created_idx ON audit_log(tenant_id, created_at DESC);`,
    },
    {
      version: "V7",
      name: "row_level_security",
      sql: `-- Flyway V7__row_level_security.sql
-- Enforce tenant isolation at the DB level (defense in depth).
ALTER TABLE repositories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_twins   ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_nodes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents         ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_repos ON repositories
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_twins ON developer_twins
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_nodes ON knowledge_nodes
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_docs ON documents
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- Spring sets app.tenant_id via a request-scoped Session variable in a Servlet Filter.`,
    },
  ],
};
