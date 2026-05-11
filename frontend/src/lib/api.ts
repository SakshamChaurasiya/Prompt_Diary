/**
 * API client utility for communicating with the FastAPI backend.
 *
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { method = "GET", body, token } = options;

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
// Auth
// =====================

export async function signup(data: {
  email: string;
  password: string;
  username?: string;
}) {
  return fetchAPI("/auth/signup", { method: "POST", body: data });
}

export async function login(data: { email: string; password: string }) {
  return fetchAPI("/auth/login", { method: "POST", body: data });
}
