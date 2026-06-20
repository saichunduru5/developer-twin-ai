import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-ink-800/70 shimmer",
        className,
      )}
      {...rest}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard({
  title = true,
  lines = 3,
  avatar = false,
  className,
}: {
  title?: boolean;
  lines?: number;
  avatar?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-ink-800/80 bg-ink-900/40 p-5",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {avatar ? <SkeletonCircle size={36} /> : null}
        <div className="flex-1 space-y-2">
          {title ? <Skeleton className="h-3.5 w-1/3" /> : null}
          <Skeleton className="h-2.5 w-2/3" />
        </div>
      </div>
      <SkeletonText lines={lines} className="mt-4" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800/80 bg-ink-900/40" aria-hidden>
      <div className="flex gap-3 border-b border-ink-800/60 bg-ink-900/60 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-ink-800/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-3 px-4 py-3">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-3 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = "No data yet.",
  loadingFallback,
  children,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingFallback: ReactNode;
  children: ReactNode;
  onRetry?: () => void;
}) {
  if (isLoading) return <>{loadingFallback}</>;
  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-6 text-sm text-rose-200">
        <div className="font-semibold">Something went wrong</div>
        <div className="mt-1 text-rose-300/80">{error?.message ?? "Unable to load data."}</div>
        {onRetry ? (
          <button
            onClick={onRetry}
            className="mt-3 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-8 text-center text-sm text-ink-400">
        {emptyMessage}
      </div>
    );
  }
  return <>{children}</>;
}
