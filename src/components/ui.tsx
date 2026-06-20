import { type ReactNode, type HTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, hover, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl border border-ink-800/80 bg-ink-900/40",
        hover && "transition hover:-translate-y-0.5 hover:border-ink-700 hover:shadow-2xl hover:shadow-black/30",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-ink-800/60 px-5 py-4", className)}>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold tracking-tight text-ink-100">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-ink-400">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

type BadgeProps = {
  tone?: "emerald" | "cyan" | "amber" | "rose" | "slate" | "violet";
  children: ReactNode;
  className?: string;
};

const badgeTones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  emerald: "bg-neural-500/10 text-neural-300 border-neural-500/30",
  cyan: "bg-cyber-500/10 text-cyber-300 border-cyber-500/30",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  slate: "bg-ink-700/40 text-ink-300 border-ink-700",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/30",
};

export function Badge({ tone = "slate", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  delta,
  deltaTone,
  hint,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  hint?: string;
}) {
  const toneClass =
    deltaTone === "up"
      ? "text-neural-300"
      : deltaTone === "down"
        ? "text-rose-300"
        : "text-ink-400";
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight text-ink-50 tabular-nums">{value}</div>
        {delta ? (
          <span className={cn("text-xs font-medium tabular-nums", toneClass)}>{delta}</span>
        ) : null}
      </div>
      {hint ? <div className="mt-1 text-xs text-ink-500">{hint}</div> : null}
    </div>
  );
}

export function Avatar({
  initials,
  size = 40,
  active,
}: {
  initials: string;
  size?: number;
  active?: boolean;
}) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-ink-700 to-ink-800 text-[11px] font-semibold text-ink-100 ring-1 ring-ink-700"
        style={{ fontSize: size * 0.34 }}
      >
        {initials}
      </div>
      {active !== undefined ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-ink-950",
            active ? "bg-neural-400" : "bg-ink-500",
          )}
        />
      ) : null}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">{eyebrow}</div>
        ) : null}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-ink-400">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Progress({
  value,
  tone = "emerald",
  className,
}: {
  value: number;
  tone?: "emerald" | "cyan" | "amber" | "rose";
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const tones: Record<string, string> = {
    emerald: "from-neural-500 to-neural-400",
    cyan: "from-cyber-500 to-cyber-400",
    amber: "from-amber-500 to-amber-400",
    rose: "from-rose-500 to-rose-400",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-800", className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r", tones[tone])}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
} & HTMLAttributes<HTMLButtonElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neural-500/60 disabled:opacity-50";
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm" };
  const variants = {
    primary:
      "bg-gradient-to-b from-neural-500 to-neural-600 text-ink-950 shadow-[0_0_0_1px_rgba(16,185,129,0.5),0_8px_24px_-8px_rgba(16,185,129,0.6)] hover:from-neural-400 hover:to-neural-500",
    ghost: "text-ink-200 hover:bg-ink-800/60",
    outline: "border border-ink-700 bg-ink-900/40 text-ink-100 hover:border-ink-600 hover:bg-ink-800/60",
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
