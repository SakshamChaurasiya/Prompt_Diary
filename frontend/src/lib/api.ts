/**
 * API client utility for communicating with the FastAPI backend.
 *
 * Automatically attaches the Supabase JWT token to authenticated requests.
 * In development, this points to localhost:8000.
 * In production, set NEXT_PUBLIC_API_URL to your deployed backend URL.
 * 
 * For authenticated requests, pass the access token from the Auth Context:
 * 
 * @example
 * import { useAuth } from "@/lib/AuthContext";
 * 
 * const { session } = useAuth();
 * const data = await fetchAPI("/protected-endpoint", {
 *   token: session?.access_token,
 * });
 */

import { createClient } from "@/lib/supabase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string;
  /** If true, automatically attach the Supabase session token */
  authenticated?: boolean;
}

/**
 * Get the current Supabase session token (if logged in).
 */
async function getSessionToken(): Promise<string | null> {
  try {
    const supabase = createClient();
    if (!supabase) return null;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { method = "GET", body, authenticated = false } = options;
  let { token } = options;

  // Auto-attach token for authenticated requests
  if (!token && authenticated) {
    token = (await getSessionToken()) ?? undefined;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Something went wrong");
  }

  return res.json();
}

// =====================
// Articles
// =====================

export async function getArticles(params?: {
  category?: string;
  difficulty?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.difficulty) query.set("difficulty", params.difficulty);
  const queryString = query.toString();
  return fetchAPI(`/articles${queryString ? `?${queryString}` : ""}`);
}

export async function getArticle(id: string) {
  return fetchAPI(`/articles/${id}`);
}

export async function getArticleBySlug(slug: string) {
  return fetchAPI(`/articles/slug/${slug}`);
}

export async function getSystemDesignArticles() {
  return fetchAPI("/articles/system-design");
}

// =====================
// Challenges
// =====================

export async function getChallenges(params?: {
  difficulty?: string;
  category?: string;
}) {
  const query = new URLSearchParams();
  if (params?.difficulty) query.set("difficulty", params.difficulty);
  if (params?.category) query.set("category", params.category);
  const queryString = query.toString();
  return fetchAPI(`/challenges${queryString ? `?${queryString}` : ""}`);
}

export async function getChallenge(id: string) {
  return fetchAPI(`/challenges/${id}`);
}

// =====================
// Roadmaps
// =====================

export async function getRoadmaps(params?: { level?: string }) {
  const query = new URLSearchParams();
  if (params?.level) query.set("level", params.level);
  const queryString = query.toString();
  return fetchAPI(`/roadmaps${queryString ? `?${queryString}` : ""}`);
}

export async function getRoadmap(id: string) {
  return fetchAPI(`/roadmaps/${id}`);
}

// =====================
// Auth (uses Supabase JWT)
// =====================

/**
 * Get the current user's profile from the backend.
 * Automatically uses the Supabase session token.
 */
export async function getMe(token?: string) {
  return fetchAPI("/auth/me", { token, authenticated: true });
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(
  data: {
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
  },
  token?: string
) {
  return fetchAPI("/auth/profile", {
    method: "PUT",
    body: data,
    token,
    authenticated: true,
  });
}

/**
 * Check authentication status against the backend.
 */
export async function checkAuthStatus(token?: string) {
  return fetchAPI("/auth/status", { token, authenticated: true });
}

// =====================
// User Progress (protected)
// =====================

/**
 * Get the current user's complete learning progress.
 */
export async function getUserProgress() {
  return fetchAPI("/user-progress", { authenticated: true });
}

/**
 * Get the current user's aggregated stats.
 */
export async function getUserStats() {
  return fetchAPI("/user-progress/stats", { authenticated: true });
}

/**
 * Mark an article as completed.
 */
export async function markArticleCompleted(articleId: string) {
  return fetchAPI("/user-progress/article", {
    method: "POST",
    body: { article_id: articleId },
    authenticated: true,
  });
}

/**
 * Mark a challenge as completed.
 */
export async function markChallengeCompleted(
  challengeId: string,
  score?: number
) {
  return fetchAPI("/user-progress/challenge", {
    method: "POST",
    body: { challenge_id: challengeId, score },
    authenticated: true,
  });
}

// =====================
// Search
// =====================

/**
 * Search across articles, challenges, and roadmaps.
 */
export async function searchContent(
  query: string,
  type?: "articles" | "challenges" | "roadmaps"
) {
  const params = new URLSearchParams({ q: query });
  if (type) params.set("type", type);
  return fetchAPI(`/search?${params.toString()}`);
}

// =====================
// Playground
// =====================

/**
 * Run a prompt against a model (simulated or real).
 */
export async function runPrompt(data: {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
}) {
  return fetchAPI("/playground/run", {
    method: "POST",
    body: data,
  });
}

/**
 * Get the list of available models for the playground.
 */
export async function getPlaygroundModels() {
  return fetchAPI("/playground/models");
}
