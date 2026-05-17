/**
 * Server-only fetch helpers for the FastAPI backend.
 * Used from Server Components so data matches the database (Supabase/Postgres via API).
 */

const DEFAULT_API = "http://localhost:8000/api/v1";

/**
 * Base URL for backend API. Prefer API_URL on the server (e.g. Docker service name);
 * falls back to NEXT_PUBLIC_API_URL for local dev and browser.
 */
export function getApiBaseUrl(): string {
  const base =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    DEFAULT_API;
  return base.replace(/\/$/, "");
}

async function apiGet<T>(path: string): Promise<T | null> {
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${p}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── Articles ───────────────────────────────────────────────────────────────

export type ApiArticle = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string;
  category: string;
  difficulty: string;
  tags?: string[] | null;
  created_at?: string;
};

export async function serverListArticles(params?: {
  category?: string;
  difficulty?: string;
}): Promise<{ articles: ApiArticle[]; total: number } | null> {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.difficulty) q.set("difficulty", params.difficulty);
  const qs = q.toString();
  return apiGet<{ articles: ApiArticle[]; total: number }>(
    `/articles${qs ? `?${qs}` : ""}`
  );
}

export async function serverGetArticleBySlug(slug: string): Promise<ApiArticle | null> {
  return apiGet<ApiArticle>(`/articles/slug/${encodeURIComponent(slug)}`);
}

export async function serverListSystemDesignArticles(): Promise<{
  articles: ApiArticle[];
  total: number;
} | null> {
  return apiGet<{ articles: ApiArticle[]; total: number }>("/articles/system-design");
}

// ─── Challenges ─────────────────────────────────────────────────────────────

export type ApiChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  starter_prompt?: string | null;
  expected_output?: string | null;
  hints?: string[] | null;
  points: number;
  created_at?: string;
};

export async function serverListChallenges(params?: {
  difficulty?: string;
  category?: string;
}): Promise<{ challenges: ApiChallenge[]; total: number } | null> {
  const q = new URLSearchParams();
  if (params?.difficulty) q.set("difficulty", params.difficulty);
  if (params?.category) q.set("category", params.category);
  const qs = q.toString();
  return apiGet<{ challenges: ApiChallenge[]; total: number }>(
    `/challenges${qs ? `?${qs}` : ""}`
  );
}

export async function serverGetChallenge(id: string): Promise<ApiChallenge | null> {
  return apiGet<ApiChallenge>(`/challenges/${encodeURIComponent(id)}`);
}

// ─── Roadmaps ─────────────────────────────────────────────────────────────────

export type ApiRoadmap = {
  id: string;
  title: string;
  level: string;
  description: string;
  topics: unknown;
  estimated_hours: number;
  created_at?: string;
};

export async function serverListRoadmaps(params?: {
  level?: string;
}): Promise<{ roadmaps: ApiRoadmap[]; total: number } | null> {
  const q = new URLSearchParams();
  if (params?.level) q.set("level", params.level);
  const qs = q.toString();
  return apiGet<{ roadmaps: ApiRoadmap[]; total: number }>(
    `/roadmaps${qs ? `?${qs}` : ""}`
  );
}

export function roadmapTopicsToStrings(topics: unknown): string[] {
  if (!Array.isArray(topics)) return [];
  return topics.map((t) => {
    if (typeof t === "string") return t;
    if (t && typeof t === "object" && "title" in t) {
      return String((t as { title: string }).title);
    }
    return String(t);
  });
}
