import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui";
import { useAuth, useFormField } from "../../lib/hooks";
import { AuthShell, Field } from "./Login";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const fullName = useFormField("", (v) => (v.trim().length < 2 ? "Enter your full name." : null));
  const email = useFormField("", (v) =>
    !v ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email." : null,
  );
  const password = useFormField("", (v) => {
    if (v.length < 8) return "At least 8 characters.";
    if (!/[A-Z]/.test(v)) return "Include one uppercase letter.";
    if (!/[0-9]/.test(v)) return "Include one number.";
    return null;
  });
  const confirm = useFormField("", (v) => (v !== password.value ? "Passwords do not match." : null));
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fullName.touch();
    email.touch();
    password.touch();
    confirm.touch();
    if (fullName.error || email.error || password.error || confirm.error) return;
    if (!fullName.value || !email.value || !password.value || !confirm.value) return;
    setSubmitting(true);
    setServerError(null);
    const res = await register({ email: email.value, password: password.value, fullName: fullName.value });
    setSubmitting(false);
    if (res.ok) navigate("/app", { replace: true });
    else setServerError(res.error ?? "Registration failed.");
  };

  const strength = computeStrength(password.value);

  return (
    <AuthShell title="Create your account" subtitle="Start preserving your team's knowledge in minutes.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          id="fullName"
          label="Full name"
          type="text"
          autoComplete="name"
          icon={<User className="h-4 w-4" />}
          placeholder="Chunduru Sai"
          state={fullName}
        />
        <Field
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@company.com"
          state={email}
        />
        <Field
          id="password"
          label="Password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="At least 8 characters"
          state={password}
          trailing={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="p-1 text-ink-400 hover:text-ink-200"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {/* Password strength */}
        <div>
          <div className="flex h-1 overflow-hidden rounded-full bg-ink-800">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-full flex-1 ${
                  i < strength.level
                    ? strength.level <= 1
                      ? "bg-rose-400"
                      : strength.level === 2
                        ? "bg-amber-400"
                        : strength.level === 3
                          ? "bg-cyber-400"
                          : "bg-neural-400"
                    : ""
                } ${i < 3 ? "mr-0.5" : ""}`}
              />
            ))}
          </div>
          <div className="mt-1 text-[11px] text-ink-500">{strength.label}</div>
        </div>

        <Field
          id="confirm"
          label="Confirm password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="Re-enter password"
          state={confirm}
        />

        <label className="flex items-start gap-2 text-xs text-ink-300">
          <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5 rounded border-ink-700 bg-ink-900 accent-neural-500" />
          <span>
            I agree to the{" "}
            <a className="text-neural-300 hover:text-neural-200" href="#terms">Terms of Service</a>{" "}
            and <a className="text-neural-300 hover:text-neural-200" href="#privacy">Privacy Policy</a>.
          </span>
        </label>

        {serverError ? (
          <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-200">
            {serverError}
          </div>
        ) : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account…" : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </Button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-ink-500">
          <ShieldCheck className="h-3.5 w-3.5 text-neural-300" />
          BCrypt-hashed · 256-bit TLS · SOC 2 aligned
        </div>

        <div className="pt-1 text-center text-xs text-ink-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-neural-300 hover:text-neural-200">
            Sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

function computeStrength(v: string): { level: number; label: string } {
  if (!v) return { level: 0, label: "Enter a password" };
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  if (v.length >= 12) score++;
  if (score <= 1) return { level: 1, label: "Weak — add uppercase, numbers, or symbols" };
  if (score === 2) return { level: 2, label: "Fair — getting there" };
  if (score === 3) return { level: 3, label: "Good — solid password" };
  return { level: 4, label: "Strong — excellent" };
}
