import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  Users,
  MessageSquareText,
  Network,
  ShieldAlert,
  LineChart,
  Search,
  FileText,
  Settings2,
  Sparkles,
  GitFork,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Cog,
  Database,
  LogOut,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { Avatar } from "./ui";
import { currentUser } from "../lib/data";
import { useAuth } from "../lib/hooks";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/repositories", label: "Repositories", icon: GitBranch, badge: "8" },
  { to: "/app/twin", label: "Developer Twin", icon: Users },
  { to: "/app/ask", label: "Ask Former Employee", icon: MessageSquareText },
  { to: "/app/knowledge-map", label: "Knowledge Map", icon: Network },
  { to: "/app/risk", label: "Risk Score", icon: ShieldAlert, badge: "2" },
  { to: "/app/analytics", label: "Analytics", icon: LineChart },
  { to: "/app/search", label: "Knowledge Search", icon: Search },
  { to: "/app/docs", label: "Documentation", icon: FileText },
  { to: "/app/architecture", label: "Architecture", icon: Settings2 },
  { to: "/app/database", label: "Database", icon: Database },
];

const userNav: NavItem[] = [
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Cog },
];

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/app"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
          isActive
            ? "bg-gradient-to-r from-neural-500/15 via-neural-500/5 to-transparent text-ink-50"
            : "text-ink-300 hover:bg-ink-800/60 hover:text-ink-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r-full bg-neural-400" />
          ) : null}
          <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-neural-300" : "text-ink-400 group-hover:text-ink-200")} />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge ? (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                isActive
                  ? "bg-neural-500/20 text-neural-300"
                  : "bg-ink-800 text-ink-300",
              )}
            >
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Close mobile drawer on route change
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="relative flex min-h-screen bg-ink-950 text-ink-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* Desktop sidebar */}
      <aside className="relative z-20 hidden w-64 shrink-0 border-r border-ink-800/80 bg-ink-950/80 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink-950/80 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-72 flex-col border-r border-ink-800 bg-ink-950 transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
            <Brand />
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-ink-400 hover:bg-ink-800 hover:text-ink-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent />
        </aside>
      </div>

      {/* Main area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onOpenMenu={() => setOpen(true)}
        />
        <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="hidden border-b border-ink-800 px-5 py-4 lg:block">
        <Brand />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Primary">
        {nav.map((n) => (
          <SidebarLink key={n.to} item={n} />
        ))}
        <div className="mt-4 mb-1 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
          Account
        </div>
        {userNav.map((n) => (
          <SidebarLink key={n.to} item={n} />
        ))}
      </nav>

      <SidebarUserBlock />
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500 to-cyber-500 shadow-lg shadow-neural-500/30">
          <Sparkles className="h-4 w-4 text-ink-950" />
        </div>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-neural-400 animate-pulse-ring" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tracking-tight text-ink-50">Developer Twin AI</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Chunduru Sai</div>
      </div>
    </div>
  );
}

function Topbar({
  dark,
  onToggleDark,
  onOpenMenu,
}: {
  dark: boolean;
  onToggleDark: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/80 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMenu}
          className="rounded-md p-2 text-ink-300 hover:bg-ink-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/60 px-3 py-1.5 text-xs text-ink-400 sm:flex sm:w-80">
          <Search className="h-3.5 w-3.5" />
          <input
            className="w-full bg-transparent text-ink-100 placeholder:text-ink-500 focus:outline-none"
            placeholder="Search knowledge base, commits, docs…   ⌘K"
          />
        </div>

        <div className="flex-1" />

        <div className="hidden items-center gap-2 sm:flex">
          <button className="inline-flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/60 px-3 py-1.5 text-xs text-ink-200 hover:border-ink-700">
            <GitFork className="h-3.5 w-3.5" />
            Connect repo
          </button>
        </div>

        <button
          onClick={onToggleDark}
          className="rounded-md p-2 text-ink-300 hover:bg-ink-800 hover:text-ink-100"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Avatar initials={currentUser.avatar} size={32} active />
      </div>
    </header>
  );
}

function SidebarUserBlock() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-ink-800 p-3">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl border border-ink-800 bg-ink-900/60 p-2.5 text-left transition hover:border-ink-700"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <Avatar initials={user?.avatar ?? currentUser.avatar} size={36} active />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink-100">{user?.name ?? currentUser.name}</div>
            <div className="truncate text-[11px] text-ink-400">{(user?.role ?? currentUser.role).replace("_", " ")}</div>
          </div>
        </button>
        {open ? (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              role="menu"
              className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl border border-ink-700 bg-ink-900/95 shadow-xl shadow-black/40 backdrop-blur-xl"
            >
              {userNav.map((n) => (
                <SidebarLink key={n.to} item={n} onNavigate={() => setOpen(false)} />
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 border-t border-ink-800 px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
                role="menuitem"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="flex-1">Sign out</span>
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

// useAuth is imported at the top of this file.

function Footer() {
  return (
    <footer className="border-t border-ink-800/60 bg-ink-950/60 py-5 text-center text-xs text-ink-500">
      <div className="mx-auto max-w-7xl px-4">
        © {new Date().getFullYear()} Developer Twin AI — Designed & archit by{" "}
        <span className="text-ink-300">Chunduru Sai</span>.{" "}
        <span className="mx-2 text-ink-700">•</span>
        <span className="font-mono text-ink-400">People Leave. Knowledge Stays.</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
