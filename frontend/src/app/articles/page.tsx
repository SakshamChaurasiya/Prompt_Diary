import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import ArticlesClient from "@/components/ArticlesClient";
import { serverListArticles, type ApiArticle } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Articles — Prompt Diary",
  description:
    "Learn prompt engineering, AI architectures, and LLM workflows through in-depth articles and tutorials.",
};

/** Used when the API is unreachable (backend down or misconfigured). */
const ARTICLES_FALLBACK: Array<{
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  difficulty: string;
  tags: string[];
  created_at: string;
}> = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Introduction to Prompt Engineering",
    slug: "intro-to-prompt-engineering",
    excerpt:
      "Learn the fundamentals of prompt engineering and why it matters in the age of AI.",
    category: "fundamentals",
    difficulty: "beginner",
    tags: ["prompt-engineering", "basics", "llm"],
    created_at: "2025-01-01",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Zero-Shot vs Few-Shot Prompting",
    slug: "zero-shot-vs-few-shot",
    excerpt:
      "Master the two foundational prompting techniques that every AI engineer needs to know.",
    category: "techniques",
    difficulty: "beginner",
    tags: ["zero-shot", "few-shot", "techniques"],
    created_at: "2025-01-15",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Chain-of-Thought Prompting",
    slug: "chain-of-thought-prompting",
    excerpt:
      "Learn how Chain-of-Thought prompting unlocks advanced reasoning in AI models.",
    category: "techniques",
    difficulty: "intermediate",
    tags: ["chain-of-thought", "reasoning", "advanced-techniques"],
    created_at: "2025-02-01",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    title: "RAG Architecture Deep Dive",
    slug: "rag-architecture-deep-dive",
    excerpt:
      "Understand the RAG architecture pattern used in production AI systems.",
    category: "architecture",
    difficulty: "advanced",
    tags: ["rag", "architecture", "vector-database"],
    created_at: "2025-02-15",
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    title: "Building AI Agent Systems",
    slug: "building-ai-agent-systems",
    excerpt:
      "Learn how to design and build autonomous AI agent systems.",
    category: "architecture",
    difficulty: "advanced",
    tags: ["agents", "architecture", "autonomous-ai"],
    created_at: "2025-03-01",
  },
];

function normalizeListItem(a: ApiArticle) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt || "",
    category: a.category,
    difficulty: a.difficulty,
    tags: Array.isArray(a.tags) ? a.tags : [],
    created_at: a.created_at || "",
  };
}

export default async function ArticlesPage() {
  const api = await serverListArticles();
  const articles =
    api?.articles?.length && api.articles.every((a) => a.slug && a.title)
      ? api.articles.map(normalizeListItem)
      : ARTICLES_FALLBACK;

  const categorySet = new Set(articles.map((a) => a.category));
  const categories = ["all", ...Array.from(categorySet).sort()];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(124,58,237,0.22))",
              border: "1px solid rgba(0,229,255,0.22)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 40px rgba(0,229,255,0.08)",
            }}
          >
            <BookOpen size={25} strokeWidth={1.8} color="#7dd3fc" />
          </span>
          Articles
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "600px",
          }}
        >
          Dive deep into prompt engineering, AI architectures, and LLM workflows.
        </p>
      </div>

      <ArticlesClient articles={articles} categories={categories} />
    </div>
  );
}
