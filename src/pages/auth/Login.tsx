import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardBody, Button } from "../../components/ui";
import { useAuth, useFormField } from "../../lib/hooks";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/app";

  const email = useFormField("", (v) => (!v ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email." : null));
  const password = useFormField("", (v) => (v.length < 8 ? "At least 8 characters." : null));
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    email.touch();
    password.touch();
    if (email.error || password.error || !email.value || !password.value) return;
    setSubmitting(true);
    setServerError(null);
    const res = await login(email.value, password.value);
    setSubmitting(false);
    if (res.ok) navigate(redirectTo, { replace: true });
    else setServerError(res.error ?? "Login failed.");
  };

  return (
    <AuthShell title="Sign in to your workspace" subtitle="People Leave. Knowledge Stays.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@company.com"
          state={email}
        />
        <Field
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          state={password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="p-1 text-ink-400 hover:text-ink-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-ink-300">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-ink-700 bg-ink-900 accent-neural-500" />
            Remember me
          </label>
          <a className="text-neural-300 hover:text-neural-200" href="#forgot">
            Forgot password?
          </a>
        </div>

        {serverError ? (
          <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-200">
            {serverError}
          </div>
        ) : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
        </Button>

        <div className="relative py-1 text-center text-[11px] uppercase tracking-[0.18em] text-ink-500">
          <span className="relative z-10 bg-ink-900 px-3">or continue with</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink-800" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2.5 text-xs text-ink-100 hover:border-ink-700 hover:bg-ink-800/60">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path fill="#eceef2" d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.33 1.08 2.9.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.33 4.68-4.55 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
            </svg>
            GitHub
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2.5 text-xs text-ink-100 hover:border-ink-700 hover:bg-ink-800/60">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Google
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-ink-400">
          New to Developer Twin AI?{" "}
          <Link to="/register" className="font-medium text-neural-300 hover:text-neural-200">
            Create an account
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

/* -------------------- shared auth shell + field -------------------- */

export function AuthShell({
  title,
  subtitle,
  children,
  side = "right",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div className="relative min-h-screen bg-ink-950 text-ink-100">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1fr_500px]">
        {/* Brand / marketing side */}
        <div className={`relative hidden flex-col justify-between p-10 lg:flex ${side === "left" ? "order-2" : "order-1"}`}>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500 to-cyber-500 shadow-lg shadow-neural-500/30">
              <Sparkles className="h-4 w-4 text-ink-950" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-ink-50">Developer Twin AI</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Chunduru Sai</div>
            </div>
          </Link>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
              // preserve engineering knowledge
            </div>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink-50">
              Every decision your team ever made,
              <br />
              <span className="bg-gradient-to-r from-neural-300 to-cyber-400 bg-clip-text text-transparent">
                searchable and citable.
              </span>
            </h1>
            <ul className="mt-8 space-y-3 text-sm text-ink-300">
              {[
                "AI-powered digital twins of every engineer",
                "Ask your former employees — get grounded answers",
                "Knowledge risk score, bus-factor warnings, remediation",
                "SOC 2 aligned, row-level tenant isolation, zero trust",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neural-300" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-ink-500">
            © {new Date().getFullYear()} Developer Twin AI · architected by Chunduru Sai
          </div>
        </div>

        {/* Form side */}
        <div className={`flex items-center justify-center p-6 sm:p-10 ${side === "left" ? "order-1" : "order-2"}`}>
          <Card className="w-full max-w-md">
            <div className="flex items-center gap-3 border-b border-ink-800/60 px-6 py-4 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500 to-cyber-500">
                <Sparkles className="h-4 w-4 text-ink-950" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-50">Developer Twin AI</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Chunduru Sai</div>
              </div>
            </div>
            <CardBody className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-ink-50">{title}</h2>
                {subtitle ? <p className="mt-1 text-sm text-ink-400">{subtitle}</p> : null}
              </div>
              {children}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

import type { FieldState } from "../../lib/hooks";
import type { ReactNode } from "react";

export function Field({
  id,
  label,
  type,
  state,
  icon,
  trailing,
  placeholder,
  autoComplete,
  helpText,
}: {
  id: string;
  label: string;
  type: string;
  state: FieldState<string>;
  icon?: ReactNode;
  trailing?: ReactNode;
  placeholder?: string;
  autoComplete?: string;
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
        <input
          id={id}
          name={id}
          type={type}
          value={state.value}
          onChange={(e) => state.setValue(e.target.value)}
          onBlur={() => state.touch()}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : helpText ? `${id}-help` : undefined}
          className="flex-1 bg-transparent text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none"
        />
        {trailing}
      </div>
      {invalid ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[11px] text-rose-300">
          {state.error}
        </p>
      ) : helpText ? (
        <p id={`${id}-help`} className="mt-1 text-[11px] text-ink-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
