import { useState } from "react";
import { User, Lock, Bell, Palette, Key, Plus, Trash2, Check, Smartphone } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Button } from "../components/ui";
import { SkeletonCard, QueryState } from "../components/Skeleton";
import { PageShell } from "../components/Layout";
import { useAppSettings, useUpdateAppSettings } from "../lib/api/queries";
import { cn } from "../utils/cn";

type SectionId = "account" | "security" | "notifications" | "appearance" | "api";

const sections: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "api", label: "API keys", icon: Key },
];

export default function Settings() {
  const [active, setActive] = useState<SectionId>("account");
  const { data: settings, isLoading, isError, error, refetch } = useAppSettings();
  const update = useUpdateAppSettings();

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">// settings</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Settings</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          Manage your account, security, notifications, and integrations. All changes are persisted
          via React Query with optimistic locking on the backend.
        </p>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        loadingFallback={
          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <SkeletonCard lines={6} />
            <SkeletonCard lines={10} />
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <Card className="h-fit">
            <CardBody className="p-2">
              <nav className="space-y-0.5" aria-label="Settings sections">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActive(s.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                        isActive
                          ? "bg-gradient-to-r from-neural-500/15 to-transparent text-ink-50"
                          : "text-ink-300 hover:bg-ink-800/50 hover:text-ink-100",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-neural-300" : "text-ink-400")} />
                      {s.label}
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>

          <Card>
            {active === "account" && <AccountSection />}
            {active === "security" && <SecuritySection />}
            {active === "notifications" && (
              <NotificationsSection
                emailNotifications={settings?.emailNotifications ?? false}
                weeklyDigest={settings?.weeklyDigest ?? false}
                marketingEmails={settings?.marketingEmails ?? false}
                onChange={(patch) => update.mutate(patch)}
                saving={update.isPending}
              />
            )}
            {active === "appearance" && (
              <AppearanceSection
                appearance={settings?.appearance ?? "dark"}
                density={settings?.density ?? "comfortable"}
                onChange={(patch) => update.mutate(patch)}
                saving={update.isPending}
              />
            )}
            {active === "api" && <ApiKeysSection keys={settings?.apiKeys ?? []} />}
          </Card>
        </div>
      </QueryState>
    </PageShell>
  );
}

/* ---------------- Account ---------------- */

function AccountSection() {
  return (
    <div>
      <CardHeader title="Account" description="Manage your account details and workspace" />
      <CardBody className="space-y-6">
        <Row label="Workspace" description="You cannot change this — contact your workspace admin.">
          <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2 text-sm text-ink-100">
            acme-fintech
          </div>
        </Row>
        <Row label="Role" description="Controls what you can see and do across the platform.">
          <Badge tone="cyan">ADMIN</Badge>
        </Row>
        <Row label="Email" description="Used for login and notifications.">
          <div className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2 text-sm text-ink-100">
            <Check className="h-3.5 w-3.5 text-neural-300" />
            sai@developertwin.ai
            <Badge tone="emerald">verified</Badge>
          </div>
        </Row>
        <Row label="Danger zone" description="Irreversible actions — requires password confirmation.">
          <div className="space-y-2">
            <button className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/10">
              Export all my data
            </button>
            <button className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/20">
              Delete my account
            </button>
          </div>
        </Row>
      </CardBody>
    </div>
  );
}

/* ---------------- Security ---------------- */

function SecuritySection() {
  return (
    <div>
      <CardHeader title="Security" description="Protect your account with multiple layers" />
      <CardBody className="space-y-6">
        <Row
          label="Password"
          description="Last changed 47 days ago. We recommend rotating every 90 days."
        >
          <Button variant="outline" size="sm">Change password</Button>
        </Row>

        <Row
          label="Two-factor authentication"
          description="Adds a second verification step when signing in."
        >
          <div className="flex items-center gap-3">
            <Badge tone="emerald"><Smartphone className="h-3 w-3" /> enabled</Badge>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </Row>

        <Row label="Active sessions" description="Devices currently signed into your account.">
          <div className="w-full space-y-2">
            {[
              { device: "MacBook Pro · Chrome 131", location: "Bengaluru, IN", current: true, lastActive: "now" },
              { device: "iPhone 15 · Safari", location: "Bengaluru, IN", lastActive: "2h ago" },
              { device: "Windows · Firefox 130", location: "Mumbai, IN", lastActive: "3d ago" },
            ].map((s) => (
              <div key={s.device} className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-ink-100">{s.device}</span>
                    {s.current ? <Badge tone="emerald">this device</Badge> : null}
                  </div>
                  <div className="text-[11px] text-ink-400">
                    {s.location} · last active {s.lastActive}
                  </div>
                </div>
                {!s.current ? (
                  <button className="text-[11px] font-medium text-rose-300 hover:text-rose-200">
                    Revoke
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </Row>

        <Row label="Recovery codes" description="One-time backup codes for 2FA recovery.">
          <div className="space-y-2">
            <Button variant="outline" size="sm">View codes</Button>
            <Button variant="ghost" size="sm">Regenerate</Button>
          </div>
        </Row>
      </CardBody>
    </div>
  );
}

/* ---------------- Notifications ---------------- */

function NotificationsSection({
  emailNotifications,
  weeklyDigest,
  marketingEmails,
  onChange,
  saving,
}: {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  onChange: (p: Record<string, boolean>) => void;
  saving: boolean;
}) {
  return (
    <div>
      <CardHeader
        title="Notifications"
        description="Choose what you want to be notified about"
        action={saving ? <span className="text-xs text-ink-400">Saving…</span> : null}
      />
      <CardBody className="space-y-1">
        <ToggleRow
          title="Knowledge risk alerts"
          description="When a service crosses the high-risk threshold."
          checked={emailNotifications}
          onChange={(v) => onChange({ emailNotifications: v })}
        />
        <ToggleRow
          title="Weekly engineering digest"
          description="A Monday summary of commits, reviews, and knowledge health."
          checked={weeklyDigest}
          onChange={(v) => onChange({ weeklyDigest: v })}
        />
        <ToggleRow
          title="Product updates & tips"
          description="Occasional news about Developer Twin AI."
          checked={marketingEmails}
          onChange={(v) => onChange({ marketingEmails: v })}
        />
      </CardBody>
    </div>
  );
}

/* ---------------- Appearance ---------------- */

function AppearanceSection({
  appearance,
  density,
  onChange,
  saving,
}: {
  appearance: "dark" | "light" | "system";
  density: "comfortable" | "compact";
  onChange: (p: Record<string, string>) => void;
  saving: boolean;
}) {
  return (
    <div>
      <CardHeader
        title="Appearance"
        description="Customize how the dashboard looks and feels"
        action={saving ? <span className="text-xs text-ink-400">Saving…</span> : null}
      />
      <CardBody className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-ink-50">Theme</div>
          <div className="mt-1 text-xs text-ink-400">Choose between light, dark, or match your OS.</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChange({ appearance: t })}
                className={cn(
                  "group rounded-xl border p-3 text-left transition",
                  appearance === t
                    ? "border-neural-500/50 bg-neural-500/5"
                    : "border-ink-800 bg-ink-900/40 hover:border-ink-700",
                )}
              >
                <div
                  className={cn(
                    "flex h-16 items-end gap-1 rounded-lg p-2",
                    t === "dark" ? "bg-gradient-to-br from-ink-900 to-ink-950" : t === "light" ? "bg-gradient-to-br from-ink-100 to-ink-200" : "bg-gradient-to-br from-ink-900 via-ink-200 to-ink-900",
                  )}
                >
                  <div className={cn("h-2 w-6 rounded", t === "light" ? "bg-ink-400" : "bg-ink-700")} />
                  <div className={cn("h-2 w-10 rounded", t === "light" ? "bg-ink-300" : "bg-ink-700")} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-ink-100">{t}</span>
                  {appearance === t ? <Check className="h-4 w-4 text-neural-300" /> : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink-50">Density</div>
          <div className="mt-1 text-xs text-ink-400">Control the amount of whitespace and spacing.</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["comfortable", "compact"] as const).map((d) => (
              <button
                key={d}
                onClick={() => onChange({ density: d })}
                className={cn(
                  "rounded-xl border p-3 text-left transition",
                  density === d
                    ? "border-neural-500/50 bg-neural-500/5"
                    : "border-ink-800 bg-ink-900/40 hover:border-ink-700",
                )}
              >
                <div className="space-y-1">
                  {Array.from({ length: d === "comfortable" ? 3 : 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 rounded bg-ink-700",
                        d === "comfortable" ? "w-full" : i % 2 === 0 ? "w-full" : "w-2/3",
                      )}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-ink-100">{d}</span>
                  {density === d ? <Check className="h-4 w-4 text-neural-300" /> : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardBody>
    </div>
  );
}

/* ---------------- API Keys ---------------- */

function ApiKeysSection({
  keys,
}: {
  keys: { name: string; prefix: string; createdAt: string }[];
}) {
  return (
    <div>
      <CardHeader
        title="API keys"
        description="Use these keys to integrate external tools with Developer Twin AI"
        action={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> New key
          </Button>
        }
      />
      <CardBody className="space-y-3">
        {keys.map((k) => (
          <div key={k.prefix} className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-900/40 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-ink-300">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-50">{k.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-ink-400">{k.prefix}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ink-500">Created {k.createdAt}</span>
              <button className="rounded-md p-1.5 text-ink-400 hover:bg-rose-500/10 hover:text-rose-300" aria-label={`Revoke ${k.name}`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-ink-800 p-4 text-center text-xs text-ink-500">
          Each key is scoped to your tenant and rotated automatically every 90 days.
        </div>
      </CardBody>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr] sm:items-center">
      <div>
        <div className="text-sm font-semibold text-ink-100">{label}</div>
        {description ? <div className="mt-0.5 text-xs text-ink-400">{description}</div> : null}
      </div>
      <div className="sm:justify-self-end">{children}</div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-ink-800 bg-ink-900/40 p-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-ink-100">{title}</div>
        <div className="mt-0.5 text-xs text-ink-400">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-neural-500" : "bg-ink-700",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-5" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}
