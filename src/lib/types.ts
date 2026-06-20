export type Role = "ADMIN" | "TEAM_LEAD" | "DEVELOPER";

export interface Repository {
  id: string;
  name: string;
  org: string;
  language: string;
  stars: number;
  commitsLast90: number;
  contributors: number;
  lastCommit: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  busFactor: number;
  knowledgeScore: number;
}

export interface Developer {
  id: string;
  name: string;
  handle: string;
  role: Role;
  avatar: string;
  tenure: string;
  active: boolean;
  expertise: number;
  commits: number;
  reviews: number;
  topLanguages: { name: string; pct: number }[];
  skills: { name: string; score: number }[];
  codingStyle: {
    avgPrSize: number;
    avgReviewTimeMin: number;
    testCoverage: number;
    docComments: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { repo: string; commit: string; author: string; snippet: string }[];
  timestamp: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "service" | "db" | "queue" | "api" | "lib";
  risk: number;
  ownerCount: number;
  x: number;
  y: number;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  weight: number;
}

export interface DocEntry {
  id: string;
  title: string;
  module: string;
  generatedAt: string;
  coverage: number;
  summary: string;
}

export interface SearchResult {
  id: string;
  title: string;
  source: string;
  type: "commit" | "pr" | "doc" | "code";
  snippet: string;
  score: number;
  author: string;
  date: string;
}
