import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../data";
import type { Developer } from "../types";

/* ---------------- useDebounce ---------------- */

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

/* ---------------- useMediaQuery ---------------- */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ---------------- useReducedMotion ---------------- */

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/* ---------------- useTheme ---------------- */

export type Theme = "dark" | "light";

const THEME_KEY = "dtai.theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(THEME_KEY) as Theme | null) ?? "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, setTheme, toggle } as const;
}

/* ---------------- useAuth (mock) ---------------- */

const AUTH_KEY = "dtai.auth";

interface AuthState {
  user: Developer | null;
  accessToken: string | null;
  expiresAt: number | null;
}

function readAuth(): AuthState {
  if (typeof window === "undefined") return { user: null, accessToken: null, expiresAt: null };
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { user: null, accessToken: null, expiresAt: null };
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(AUTH_KEY);
      return { user: null, accessToken: null, expiresAt: null };
    }
    return parsed;
  } catch {
    return { user: null, accessToken: null, expiresAt: null };
  }
}

function writeAuth(state: AuthState) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: {
    email: string;
    password: string;
    fullName: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => readAuth());
  const navigate = useNavigate();
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    writeAuth(state);
  }, [state]);

  const login = useCallback<AuthActions["login"]>(async (email, password) => {
    await new Promise((r) => window.setTimeout(r, 650));
    const normalized = email.trim().toLowerCase();
    if (!normalized) return { ok: false, error: "Email is required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return { ok: false, error: "Enter a valid email." };
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    setState({
      user: { ...currentUser, handle: normalized.split("@")[0], name: currentUser.name },
      accessToken: "mock-access-" + Math.random().toString(36).slice(2),
      expiresAt: Date.now() + 15 * 60_000,
    });
    return { ok: true };
  }, []);

  const register = useCallback<AuthActions["register"]>(async ({ email, password, fullName }) => {
    await new Promise((r) => window.setTimeout(r, 800));
    const normalized = email.trim().toLowerCase();
    if (!normalized) return { ok: false, error: "Email is required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return { ok: false, error: "Enter a valid email." };
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { ok: false, error: "Password must include an uppercase letter and a number." };
    }
    if (fullName.trim().length < 2) return { ok: false, error: "Enter your full name." };
    setState({
      user: {
        ...currentUser,
        name: fullName.trim(),
        handle: normalized.split("@")[0],
        avatar: initials(fullName),
      },
      accessToken: "mock-access-" + Math.random().toString(36).slice(2),
      expiresAt: Date.now() + 15 * 60_000,
    });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, accessToken: null, expiresAt: null });
    navigate("/login", { replace: true });
  }, [navigate]);

  return useMemo(
    () => ({
      user: state.user,
      isAuthenticated: Boolean(state.user),
      login,
      register,
      logout,
    }),
    [state.user, login, register, logout],
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

/* ---------------- useToggle ---------------- */

export function useToggle(initial = false) {
  const [v, setV] = useState(initial);
  const toggle = useCallback(() => setV((x) => !x), []);
  const on = useCallback(() => setV(true), []);
  const off = useCallback(() => setV(false), []);
  return { value: v, toggle, on, off, set: setV } as const;
}

/* ---------------- useFormField ---------------- */

export interface FieldState<T> {
  value: T;
  error: string | null;
  touched: boolean;
  setValue: (v: T) => void;
  setError: (e: string | null) => void;
  touch: () => void;
  reset: (v: T) => void;
}

export function useFormField<T>(initial: T, validate?: (v: T) => string | null): FieldState<T> {
  const [value, setValueRaw] = useState<T>(initial);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setValue = useCallback(
    (v: T) => {
      setValueRaw(v);
      if (validate) setError(validate(v));
    },
    [validate],
  );

  const reset = useCallback(
    (v: T) => {
      setValueRaw(v);
      setError(null);
      setTouched(false);
    },
    [],
  );

  return {
    value,
    error: touched ? error : null,
    touched,
    setValue,
    setError,
    touch: () => setTouched(true),
    reset,
  };
}
