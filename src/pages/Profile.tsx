import { Camera, Save, Mail, Globe, Clock, User, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Button } from "../components/ui";
import { Avatar } from "../components/ui";
import { Skeleton, SkeletonCard, QueryState } from "../components/Skeleton";
import { PageShell } from "../components/Layout";
import { useProfile, useUpdateProfile } from "../lib/api/queries";
import { useFormField, useAuth } from "../lib/hooks";
import { useEffect } from "react";

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const update = useUpdateProfile();

  const name = useFormField("");
  const handle = useFormField("");
  const email = useFormField("", (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email." : null));
  const bio = useFormField("");
  const timezone = useFormField("");

  useEffect(() => {
    if (profile) {
      name.setValue(profile.name);
      handle.setValue(profile.handle);
      email.setValue(profile.email);
      bio.setValue(profile.bio);
      timezone.setValue(profile.timezone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.name, profile?.email]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.error) return;
    await update.mutateAsync({
      name: name.value,
      handle: handle.value,
      email: email.value,
      bio: bio.value,
      timezone: timezone.value,
    });
  };

  return (
    <PageShell>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">// profile</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">Your profile</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          This information is shown to your team and embedded in your developer twin.
        </p>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <SkeletonCard avatar lines={6} />
            <SkeletonCard lines={10} />
          </div>
        }
        onRetry={refetch}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <Card>
            <CardHeader title="Identity" description="How your twin is presented" />
            <CardBody className="space-y-5">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <Avatar initials={user?.avatar ?? "CS"} size={96} active />
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-ink-700 bg-ink-900 text-ink-200 hover:border-ink-600 hover:bg-ink-800"
                    aria-label="Change avatar"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <div className="text-base font-semibold text-ink-50">{user?.name}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-ink-400">@{user?.handle}</div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Badge tone="cyan">{user?.role.replace("_", " ")}</Badge>
                    <Badge tone="emerald">active</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-ink-800/60 pt-4">
                <Mini label="Expertise" value={user?.expertise ?? 0} hint="composite" />
                <Mini label="Commits" value={user?.commits ?? 0} hint="lifetime" />
                <Mini label="Reviews" value={user?.reviews ?? 0} hint="lifetime" />
                <Mini label="Tenure" value={user?.tenure ?? "—"} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Account details"
              description="Editable fields — saved via React Query mutation"
              action={
                update.isSuccess ? (
                  <span className="inline-flex items-center gap-1 text-xs text-neural-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                  </span>
                ) : null
              }
            />
            <form onSubmit={onSave}>
              <CardBody className="space-y-4">
                <Editable
                  id="name"
                  label="Full name"
                  icon={<User className="h-4 w-4" />}
                  state={name}
                />
                <Editable
                  id="handle"
                  label="Handle"
                  icon={<span className="font-mono text-xs">@</span>}
                  state={handle}
                  prefix="@"
                />
                <Editable
                  id="email"
                  label="Email"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  state={email}
                />
                <Editable
                  id="timezone"
                  label="Timezone"
                  icon={<Clock className="h-4 w-4" />}
                  state={timezone}
                  helpText="Used for scheduling notifications and reports."
                />
                <div>
                  <label htmlFor="bio" className="mb-1.5 block text-xs font-medium text-ink-200">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio.value}
                    onChange={(e) => bio.setValue(e.target.value)}
                    rows={4}
                    maxLength={280}
                    className="w-full resize-none rounded-lg border border-ink-800 bg-ink-900/60 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-neural-500/50 focus:outline-none"
                    placeholder="Tell your team about yourself."
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-ink-500">
                    <span>Shown on your twin card and in chat answers.</span>
                    <span className="tabular-nums">{bio.value.length}/280</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-ink-800/60 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (profile) {
                        name.setValue(profile.name);
                        handle.setValue(profile.handle);
                        email.setValue(profile.email);
                        bio.setValue(profile.bio);
                        timezone.setValue(profile.timezone);
                      }
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={update.isPending}>
                    {update.isPending ? "Saving…" : <><Save className="h-4 w-4" /> Save changes</>}
                  </Button>
                </div>
              </CardBody>
            </form>
          </Card>
        </div>

        <Card>
          <CardHeader title="Activity footprint" description="Last 26 weeks of your engineering activity" />
          <CardBody>
            <div className="flex items-center gap-4">
              <Globe className="h-4 w-4 text-ink-400" />
              <span className="text-xs text-ink-300">Your twin is updated every 15 minutes from connected repositories.</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-neural-500/10 px-2.5 py-0.5 text-[11px] font-medium text-neural-300 ring-1 ring-neural-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-neural-400 animate-pulse" />
                Live
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="mt-4 h-24 w-full" />
            ) : (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
                {Array.from({ length: 24 }).map((_, i) => {
                  const level = (i * 7) % 5;
                  const tones = ["bg-ink-800", "bg-neural-900", "bg-neural-700", "bg-neural-500", "bg-neural-400"];
                  return <div key={i} className={`aspect-square rounded ${tones[level]}`} />;
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </QueryState>
    </PageShell>
  );
}

function Mini({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-3">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <div className="text-lg font-semibold tabular-nums text-ink-50">{value}</div>
        {hint ? <span className="text-[10px] text-ink-400">{hint}</span> : null}
      </div>
    </div>
  );
}

function Editable({
  id,
  label,
  icon,
  state,
  type = "text",
  prefix,
  helpText,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  state: ReturnType<typeof useFormField<string>>;
  type?: string;
  prefix?: string;
  helpText?: string;
}) {
  const invalid = Boolean(state.touched && state.error);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-200">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-lg border bg-ink-900/60 px-3 py-2.5 transition focus-within:border-neural-500/50 ${
          invalid ? "border-rose-500/50" : "border-ink-800"
        }`}
      >
        {icon ? <span className="text-ink-400">{icon}</span> : null}
        {prefix ? <span className="text-ink-500">{prefix}</span> : null}
        <input
          id={id}
          name={id}
          type={type}
          value={state.value}
          onChange={(e) => state.setValue(e.target.value)}
          onBlur={() => state.touch()}
          aria-invalid={invalid}
          className="flex-1 bg-transparent text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none"
        />
      </div>
      {invalid ? (
        <p role="alert" className="mt-1 text-[11px] text-rose-300">{state.error}</p>
      ) : helpText ? (
        <p className="mt-1 text-[11px] text-ink-500">{helpText}</p>
      ) : null}
    </div>
  );
}
