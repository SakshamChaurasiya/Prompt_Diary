import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Home,
  Tag,
} from "lucide-react";
import ArticleReadingProgress from "@/components/ArticleReadingProgress";
import { serverGetArticleBySlug, serverListArticles } from "@/lib/server-api";

// ─── Offline fallback (when API is down) ─────────────────────────────────────

const FALLBACK_BY_SLUG: Record<string, {
  title: string;
  category: string;
  difficulty: string;
  content: string;
  tags: string[];
  created_at: string;
}> = {
  "intro-to-prompt-engineering": {
    title: "Introduction to Prompt Engineering",
    category: "fundamentals",
    difficulty: "beginner",
    tags: ["prompt-engineering", "basics", "llm"],
    created_at: "January 1, 2025",
    content: `Prompt engineering is the art and science of crafting effective prompts to get the best results from Large Language Models (LLMs).

## What is a Prompt?

A prompt is the input text you provide to an AI model to get a desired output. It can be a question, instruction, or context that guides the model's response.

## Why Does It Matter?

The quality of your prompt directly affects the quality of the AI's response. A well-crafted prompt can:

- **Improve accuracy** — Get more precise and relevant answers
- **Save time** — Reduce the need for follow-up queries
- **Unlock capabilities** — Access advanced model features
- **Reduce costs** — Fewer tokens needed for good results

## Key Principles

### 1. Be Specific
Clearly state what you want. Instead of "Tell me about dogs", try "List the top 5 most popular dog breeds in the US with a brief description of each breed's temperament."

### 2. Provide Context
Give the model relevant background information. Context helps the model understand the domain and produce more relevant outputs.

### 3. Set the Format
Specify how you want the output structured. For example: "Format your response as a JSON object" or "Present this as a numbered list."

### 4. Use Examples
Show the model what good output looks like. This is known as "few-shot prompting" and can dramatically improve response quality.

## Getting Started

The best way to learn prompt engineering is through practice. Start with simple prompts and gradually increase complexity as you understand how models respond to different inputs.

**Next Steps:** Learn about Zero-Shot and Few-Shot Prompting →`,
  },
  "zero-shot-vs-few-shot": {
    title: "Zero-Shot vs Few-Shot Prompting",
    category: "techniques",
    difficulty: "beginner",
    tags: ["zero-shot", "few-shot", "techniques"],
    created_at: "January 15, 2025",
    content: `Understanding the difference between zero-shot and few-shot prompting is fundamental to effective prompt engineering.

## Zero-Shot Prompting

Zero-shot prompting means asking the model to perform a task **without any examples**. You rely purely on the model's pre-trained knowledge.

\`\`\`
Classify the sentiment of this review: "This product is amazing!"
\`\`\`

The model uses its training to understand what "classify sentiment" means and responds accordingly.

## Few-Shot Prompting

Few-shot prompting provides **examples** of the desired input-output pairs before the actual task.

\`\`\`
Classify the sentiment:
"I love this!" → Positive
"This is terrible" → Negative
"It's okay" → Neutral

"This product is amazing!" →
\`\`\`

## When to Use Which?

| Approach | Best For | Limitations |
|----------|----------|-------------|
| Zero-Shot | Simple, well-defined tasks | May lack precision |
| Few-Shot | Complex or nuanced tasks | Uses more tokens |

## Best Practices

- **Start with zero-shot** and add examples only if needed
- **Use 2-5 examples** for few-shot (more isn't always better)
- **Ensure examples are diverse** and representative of edge cases
- **Order matters** — put the most relevant examples last`,
  },
  "chain-of-thought-prompting": {
    title: "Chain-of-Thought Prompting",
    category: "techniques",
    difficulty: "intermediate",
    tags: ["chain-of-thought", "reasoning", "advanced-techniques"],
    created_at: "February 1, 2025",
    content: `Chain-of-Thought (CoT) prompting encourages the model to break down complex problems into intermediate reasoning steps.

## The Core Idea

Instead of asking for a direct answer, you prompt the model to "think step by step." This dramatically improves performance on mathematical reasoning, logic puzzles, multi-step problems, and complex analysis.

## Example

**Without CoT:** "If a store has 23 apples and receives 3 boxes of 12 apples each, how many apples total?"

**With CoT:** "If a store has 23 apples and receives 3 boxes of 12 apples each, how many apples total? Let's think step by step."

The model will now show its reasoning:
1. Starting apples: 23
2. Apples per box: 12
3. Number of boxes: 3
4. New apples: 12 × 3 = 36
5. Total: 23 + 36 = **59**

## Variants

### Zero-Shot CoT
Simply add "Let's think step by step" to any prompt. Surprisingly effective!

### Manual CoT
Provide worked examples with explicit reasoning chains before the actual problem.

### Self-Consistency
Generate multiple CoT paths and take the majority vote on the answer.`,
  },
  "rag-architecture-deep-dive": {
    title: "RAG Architecture Deep Dive",
    category: "architecture",
    difficulty: "advanced",
    tags: ["rag", "architecture", "vector-database"],
    created_at: "February 15, 2025",
    content: `Retrieval-Augmented Generation (RAG) is a hybrid architecture that combines information retrieval with text generation.

## Why RAG?

LLMs have a knowledge cutoff date and can hallucinate facts. RAG solves both problems by grounding responses in real, up-to-date data.

## Architecture Flow

\`\`\`
User Query → Embedding → Vector Search → Retrieved Context → LLM → Response
\`\`\`

## Core Components

### 1. Document Store
Your knowledge base — PDFs, documentation, databases, wikis, etc.

### 2. Embedding Model
Converts text to dense vector representations (e.g., OpenAI's text-embedding-3-small).

### 3. Vector Database
Stores and efficiently searches embeddings (e.g., Pinecone, Weaviate, ChromaDB).

### 4. Retriever
Given a query, finds the most relevant document chunks using similarity search.

### 5. Generator
An LLM that produces the final answer, grounded in the retrieved context.

## Implementation Steps

1. **Chunk** your documents into manageable pieces (500-1000 tokens)
2. **Generate embeddings** for each chunk
3. **Store** embeddings in a vector database
4. At query time, **embed** the user's question
5. **Retrieve** the most similar chunks (top-k)
6. **Feed** retrieved context + question to the LLM
7. **Return** the generated answer

## Best Practices

- Use overlapping chunks to avoid losing context at boundaries
- Implement hybrid search (semantic + keyword) for better recall
- Add metadata filtering to narrow results before semantic search
- Always include source citations in responses`,
  },
  "building-ai-agent-systems": {
    title: "Building AI Agent Systems",
    category: "architecture",
    difficulty: "advanced",
    tags: ["agents", "architecture", "autonomous-ai"],
    created_at: "March 1, 2025",
    content: `AI agents are autonomous systems that can plan, reason, and take actions to accomplish complex tasks.

## What is an AI Agent?

An AI agent is an LLM-powered system that can understand a goal, break it into sub-tasks, use tools to accomplish each task, and reflect on results.

## Agent Architecture

\`\`\`
Goal → Planning → Tool Selection → Execution → Observation → Reflection → (loop)
\`\`\`

## Core Components

### 1. Planning Module
The agent breaks down complex tasks into actionable steps using techniques like task decomposition and goal refinement.

### 2. Tool Use
Agents extend LLM capabilities by calling external tools:
- Web search
- Code execution
- Database queries
- API calls
- File operations

### 3. Memory
- **Short-term (Working)**: Current conversation and task context
- **Long-term (Persistent)**: Knowledge base, past experiences, learned preferences

### 4. Reflection
The agent evaluates its own outputs, identifies errors, and decides whether to iterate or conclude.

## Popular Frameworks

- **LangChain Agents** — Most popular, extensive tool ecosystem
- **CrewAI** — Multi-agent collaboration framework
- **AutoGen** — Microsoft's conversational agent framework
- **LlamaIndex** — Optimized for data-intensive agent tasks

## Design Patterns

### ReAct (Reasoning + Acting)
Interleave reasoning traces with actions. The agent thinks about what to do, does it, observes the result, and reasons about next steps.

### Plan-and-Execute
First generate a complete plan, then execute each step sequentially. Good for complex, multi-step tasks.

### Multi-Agent
Multiple specialized agents collaborate — one plans, one researches, one writes, one reviews.`,
  },
};

// Related articles when API list is empty
const STATIC_RELATED_META = [
  { slug: "intro-to-prompt-engineering", title: "Introduction to Prompt Engineering", category: "fundamentals" },
  { slug: "zero-shot-vs-few-shot", title: "Zero-Shot vs Few-Shot Prompting", category: "techniques" },
  { slug: "chain-of-thought-prompting", title: "Chain-of-Thought Prompting", category: "techniques" },
  { slug: "rag-architecture-deep-dive", title: "RAG Architecture Deep Dive", category: "architecture" },
  { slug: "building-ai-agent-systems", title: "Building AI Agent Systems", category: "architecture" },
];

type DisplayArticle = {
  title: string;
  category: string;
  difficulty: string;
  content: string;
  tags: string[];
  created_at: string;
};

function formatArticleDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return iso;
}

async function resolveDisplayArticle(slug: string): Promise<DisplayArticle | null> {
  const api = await serverGetArticleBySlug(slug);
  if (api?.title) {
    const body =
      api.content?.trim() ||
      (api.excerpt ? `# ${api.title}\n\n${api.excerpt}` : "");
    return {
      title: api.title,
      category: api.category,
      difficulty: api.difficulty,
      content: body,
      tags: Array.isArray(api.tags) ? api.tags : [],
      created_at: formatArticleDate(api.created_at),
    };
  }
  const fb = FALLBACK_BY_SLUG[slug];
  if (!fb) return null;
  return { ...fb, tags: fb.tags };
}

async function buildRelated(slug: string, category: string) {
  const list = await serverListArticles();
  const fromApi = (list?.articles ?? [])
    .map((a) => ({ slug: a.slug, title: a.title, category: a.category }))
    .filter((a) => a.slug !== slug && a.category === category)
    .slice(0, 3);
  if (fromApi.length > 0) return fromApi;
  return STATIC_RELATED_META.filter((a) => a.slug !== slug && a.category === category).slice(0, 3);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function getDifficultyColor(difficulty: string) {
  const map: Record<string, string> = {
    beginner: "#34d399",
    intermediate: "#60a5fa",
    advanced: "#f87171",
  };
  return map[difficulty] || "#9595a8";
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let inTable = false;
  let tableRows: string[][] = [];
  let key = 0;

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const body = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={`table-${key}`} style={{ overflowX: "auto", margin: "20px 0" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    background: "rgba(124,58,237,0.12)",
                    color: "#c4b5fd",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(124,58,237,0.2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr
                key={ri}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "10px 16px",
                      color: "var(--text-secondary)",
                      verticalAlign: "top",
                    }}
                  >
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  const parseInline = (text: string) =>
    text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color:var(--text-primary);font-weight:600">$1</strong>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(124,58,237,0.15);padding:2px 8px;border-radius:4px;font-family:var(--font-geist-mono),monospace;font-size:0.82em;color:#c4b5fd">$1</code>'
      );

  for (const line of lines) {
    key++;

    // ── Code blocks ──
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={key}
            style={{
              background: "rgba(0,0,0,0.45)",
              padding: "20px 24px",
              borderRadius: "12px",
              border: "1px solid rgba(124,58,237,0.15)",
              overflowX: "auto",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.83rem",
              lineHeight: 1.7,
              margin: "20px 0",
              color: "#e2e8f0",
            }}
          >
            <code>{codeContent.replace(/\n$/, "")}</code>
          </pre>
        );
        codeContent = "";
        inCodeBlock = false;
      } else {
        if (inTable) flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // ── Tables ──
    if (line.startsWith("|")) {
      const cells = line.split("|").slice(1, -1);
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // ── Blank lines — skip consecutive ones ──
    if (line.trim() === "") {
      // Only add spacing via margins on elements; no <br>
      continue;
    }

    // ── Headings ──
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key}
          style={{
            fontSize: "1.45rem",
            fontWeight: 700,
            marginTop: "44px",
            marginBottom: "14px",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key}
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            marginTop: "28px",
            marginBottom: "10px",
            color: "#c4b5fd",
          }}
        >
          {line.slice(4)}
        </h3>
      );
    }
    // ── Lists ──
    else if (line.startsWith("- ")) {
      elements.push(
        <li
          key={key}
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            marginLeft: "20px",
            marginBottom: "6px",
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: parseInline(line.slice(2)) }}
        />
      );
    } else if (line.match(/^\d+\./)) {
      elements.push(
        <li
          key={key}
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            marginLeft: "20px",
            marginBottom: "6px",
            lineHeight: 1.75,
            listStyleType: "decimal",
          }}
          dangerouslySetInnerHTML={{
            __html: parseInline(line.replace(/^\d+\.\s*/, "")),
          }}
        />
      );
    }
    // ── Paragraphs ──
    else {
      elements.push(
        <p
          key={key}
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.97rem",
            lineHeight: 1.85,
            marginBottom: "14px",
          }}
          dangerouslySetInnerHTML={{ __html: parseInline(line) }}
        />
      );
    }
  }

  if (inTable) flushTable();
  return elements;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolveDisplayArticle(slug);
  if (!article) return { title: "Article Not Found — Prompt Dairy" };
  return {
    title: `${article.title} — Prompt Diary`,
    description: `Learn about ${article.title}. A ${article.difficulty}-level article on ${article.category}.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await resolveDisplayArticle(slug);

  // ── 404 ──
  if (!article) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "120px 24px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            width: "76px",
            height: "76px",
            borderRadius: "22px",
            margin: "0 auto 24px",
            background:
              "linear-gradient(135deg, rgba(0,229,255,0.14), rgba(124,58,237,0.2))",
            border: "1px solid rgba(0,229,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileText size={36} strokeWidth={1.7} color="#7dd3fc" />
        </span>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Article Not Found
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
          The article you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/articles"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Articles
        </Link>
      </div>
    );
  }

  const related = await buildRelated(slug, article.category);

  const readingTime = getReadingTime(article.content);
  const diffColor = getDifficultyColor(article.difficulty);

  return (
    <>
      {/* Reading progress bar */}
      <ArticleReadingProgress />

      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* ── Breadcrumb ── */}
        <nav
          style={{
            marginBottom: "36px",
            fontSize: "0.83rem",
            color: "var(--text-muted)",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Home size={14} />
            Home
          </Link>
          <span>›</span>
          <Link
            href="/articles"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            Articles
          </Link>
          <span>›</span>
          <span style={{ color: "var(--text-secondary)" }}>
            {article.title}
          </span>
        </nav>

        {/* ── Header ── */}
        <header style={{ marginBottom: "40px" }}>
          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "18px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span className={`badge badge-${article.difficulty}`}>
              {article.difficulty}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-muted)",
                textTransform: "capitalize",
              }}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              marginBottom: "20px",
            }}
          >
            {article.title}
          </h1>

          {/* Meta bar */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              paddingBottom: "20px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CalendarDays size={15} />
              {article.created_at}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Clock3 size={15} />
              {readingTime}
            </span>
            <span
              style={{
                textTransform: "capitalize",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Tag size={15} />
              <span style={{ color: diffColor, fontWeight: 600 }}>
                {article.difficulty}
              </span>
            </span>
          </div>
        </header>

        {/* ── Article Content ── */}
        <article
          className="glass-card"
          style={{ padding: "40px 44px", marginBottom: "36px", lineHeight: 1.8 }}
        >
          {renderContent(article.content)}
        </article>

        {/* ── Tags ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          {article.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.75rem",
                padding: "5px 14px",
                borderRadius: "20px",
                background: "rgba(124,58,237,0.1)",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.18)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontWeight: 700,
                marginBottom: "16px",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.78rem",
              }}
            >
              Related Articles
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/articles/${rel.slug}`}
                  className="glass-card"
                  style={{
                    padding: "16px 20px",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {rel.title}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      flexShrink: 0,
                      display: "inline-flex",
                    }}
                  >
                    <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Back Button ── */}
        <Link
          href="/articles"
          className="btn-secondary"
          style={{
            fontSize: "0.9rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Articles
        </Link>
      </div>
    </>
  );
}
