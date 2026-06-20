import { useState } from "react";
import { Send, Bot, User, GitCommit, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Button } from "../components/ui";
import { PageShell } from "../components/Layout";
import { seedConversation } from "../lib/data";
import type { ChatMessage } from "../lib/types";

const suggestedPrompts = [
  "Why was Redis introduced into payment-gateway?",
  "Who owns the ledger-core module and why is it risky?",
  "Explain the KYC state machine in plain English.",
  "Summarize the last 30 days of identity-service changes.",
];

export default function AskFormer() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedConversation);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content: generateAnswer(q),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: [
          {
            repo: "acme-fintech/payment-gateway",
            commit: "8f2c1a4",
            author: "priya.nair",
            snippet: "feat(cache): add Redis idempotency store",
          },
          {
            repo: "acme-fintech/ledger-core",
            commit: "a12ff02",
            author: "priya.nair",
            snippet: "refactor: saga compensating transactions",
          },
        ],
      };
      setMessages((m) => [...m, reply]);
      setThinking(false);
    }, 900);
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neural-400">
            // ask former employee
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-50">
            Ask your former employees
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-400">
            RAG-powered answers grounded in the commits, PRs, and docs written by people who have
            since left. Every answer cites the exact commit and author.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="emerald">Gemini online</Badge>
          <Badge tone="cyan">ChromaDB sync</Badge>
          <Badge tone="violet">RAG v2</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="flex h-[640px] flex-col overflow-hidden">
          <CardHeader
            title="Conversation"
            description="Twin of priya.nair · senior engineer · departed 2mo ago"
            action={
              <button className="inline-flex items-center gap-1.5 rounded-md p-1.5 text-ink-400 hover:bg-ink-800 hover:text-ink-100">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {thinking ? (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-neural-500 to-cyber-500 text-ink-950">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="glass flex items-center gap-1.5 rounded-xl border border-ink-800 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neural-300" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neural-300" style={{ animationDelay: "0.2s" }} />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neural-300" style={{ animationDelay: "0.4s" }} />
                  <span className="ml-2 text-xs text-ink-400">Retrieving from 2,418 embeddings…</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-ink-800/60 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-2 focus-within:border-neural-500/40">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about any architectural decision, trade-off, or incident…"
                  rows={1}
                  className="w-full resize-none bg-transparent text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
                />
              </div>
              <Button type="submit" disabled={!input.trim() || thinking}>
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> answers are grounded in 1,286 indexed commits
              </span>
              <span>⏎ to send · ⇧⏎ for newline</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Suggested prompts" description="Try these to see the twin in action" />
            <CardBody className="space-y-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="group flex w-full items-start gap-2 rounded-lg border border-ink-800 bg-ink-900/40 p-3 text-left text-xs text-ink-200 transition hover:border-neural-500/30 hover:bg-ink-900/70"
                >
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-neural-300 opacity-60 group-hover:opacity-100" />
                  {p}
                </button>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="How it works" description="The RAG pipeline under the hood" />
            <CardBody>
              <ol className="space-y-3 text-xs">
                {[
                  ["Ingest", "Commits, PRs, and docs are chunked and embedded via Gemini."],
                  ["Store", "Vectors are written to ChromaDB, keyed by org/repo."],
                  ["Retrieve", "Hybrid search (vector + BM25) returns top-k passages."],
                  ["Rerank", "Gemini reranks and filters hallucination-prone passages."],
                  ["Generate", "Final answer is streamed with inline commit citations."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neural-500/40 bg-neural-500/10 text-[10px] font-semibold text-neural-300">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-ink-50">{t}</div>
                      <div className="text-ink-400">{d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={
          isUser
            ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-800 text-ink-200"
            : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-neural-500 to-cyber-500 text-ink-950"
        }
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`flex max-w-[85%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={
            isUser
              ? "rounded-2xl rounded-tr-sm bg-neural-500/15 px-4 py-2.5 text-sm text-ink-50 ring-1 ring-neural-500/20"
              : "glass rounded-2xl rounded-tl-sm border border-ink-800 px-4 py-2.5 text-sm text-ink-100"
          }
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        <div className="mt-1.5 text-[10px] text-ink-500">{message.timestamp}</div>
        {message.sources && message.sources.length > 0 ? (
          <div className="mt-2 w-full space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-ink-500">Sources</div>
            {message.sources.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-2 font-mono text-[11px]"
              >
                <GitCommit className="h-3 w-3 shrink-0 text-neural-300" />
                <span className="truncate text-ink-200">{s.snippet}</span>
                <span className="shrink-0 text-ink-500">{s.author}</span>
                <span className="shrink-0 text-ink-600">{s.commit}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function generateAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("redis") || lower.includes("payment")) {
    return "Redis was introduced in Q3 2024 to offload idempotency-key lookups from PostgreSQL. Priya Nair's PR #4812 (merged 2024-08-19) documents that p99 latency on /v1/payments dropped from 312ms to 84ms. The TTL is 24h to match the retry window. Sentinel was chosen over Cluster because our write path is single-master and we needed faster failover.";
  }
  if (lower.includes("ledger") || lower.includes("risk")) {
    return "ledger-core is rated CRITICAL because its bus factor is 1: 82% of commits belong to priya.nair, who departed 2 months ago. The saga rollback path is only partially documented (4 of 7 compensating transactions). Recommend pairing arjun.mehta with ananya.rao for a 2-week knowledge transfer.";
  }
  if (lower.includes("kyc") || lower.includes("state")) {
    return "The KYC pipeline is a state machine with 6 states: initiated → documents_uploaded → verifying → manual_review → approved | rejected. Transition rules for manual_review → escalated are inferred from tests only — the commit history shows no explicit documentation. Auto-generator coverage is 58%.";
  }
  if (lower.includes("identity") || lower.includes("auth")) {
    return "identity-service uses refresh-token rotation with a 15min access / 7d refresh split. Refresh tokens live in httpOnly Secure cookies; rotation-on-reuse is enforced via a revocation list. Recent commits added rate-limiting on /v1/auth/refresh after a detected credential-stuffing attempt.";
  }
  return "Based on the commit history in acme-fintech, the closest relevant context is from priya.nair (2mo ago) and ananya.rao (3mo ago). I've pulled the two most relevant commits — but the original author is no longer on the team. Consider opening a follow-up with the current owner for confirmation.";
}
