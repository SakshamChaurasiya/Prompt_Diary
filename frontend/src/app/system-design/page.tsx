import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle,
  Database,
  GitBranch,
  Layers,
  Network,
  Route,
  Search,
  Server,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { serverListSystemDesignArticles } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "System Design — Prompt Diary",
  description:
    "Architecture-focused learning articles for AI systems and LLM workflows.",
};

type ApiArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
};

type SystemDesignArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: string;
  icon: LucideIcon;
  accent: string;
};

type ArchitectureStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type ChecklistItem = string;

const fallbackArticles: SystemDesignArticle[] = [
  {
    id: "sd-001",
    slug: "rag-architecture-deep-dive",
    title: "RAG Architecture Deep Dive",
    excerpt:
      "Understand retrieval, embeddings, vector databases, and how LLMs generate grounded answers.",
    level: "Advanced",
    icon: Database,
    accent: "#06b6d4",
  },
  {
    id: "sd-002",
    slug: "building-ai-agent-systems",
    title: "Building AI Agent Systems",
    excerpt:
      "Learn how agents plan, use tools, maintain memory, and execute multi-step workflows.",
    level: "Advanced",
    icon: GitBranch,
    accent: "#8b5cf6",
  },
  {
    id: "sd-003",
    slug: "chain-of-thought-prompting",
    title: "Reasoning Workflows",
    excerpt:
      "Design prompting flows that improve reasoning, decomposition, and structured output quality.",
    level: "Intermediate",
    icon: Sparkles,
    accent: "#3b82f6",
  },
];

const architectureFlow: ArchitectureStep[] = [
  {
    title: "User Request",
    description: "Input from user, app, or API client.",
    icon: Route,
  },
  {
    title: "Prompt Layer",
    description: "System prompt, user prompt, examples, and output format.",
    icon: Sparkles,
  },
  {
    title: "Retrieval Layer",
    description: "Search documents, embeddings, and vector database context.",
    icon: Search,
  },
  {
    title: "Model Layer",
    description: "LLM generates answer using prompt and retrieved context.",
    icon: Server,
  },
  {
    title: "Safety & Evaluation",
    description: "Validate output, check quality, citations, and guardrails.",
    icon: Shield,
  },
];

const checklist: ChecklistItem[] = [
  "Define user goal and success metrics",
  "Choose data source and storage strategy",
  "Design retrieval or tool-calling flow",
  "Add prompt templates and output format",
  "Handle latency, cost, and rate limits",
  "Add evaluation, monitoring, and safety checks",
];

export default async function SystemDesignPage() {
  const data = await serverListSystemDesignArticles();
  const apiArticles: ApiArticle[] = Array.isArray(data?.articles)
    ? data.articles
    : [];

  const articles: SystemDesignArticle[] =
    apiArticles.length > 0
      ? apiArticles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          level: "Architecture",
          icon: Layers,
          accent: "#06b6d4",
        }))
      : fallbackArticles;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      {/* Header */}
      <section style={{ marginBottom: "42px" }}>
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(124,58,237,0.2))",
            border: "1px solid rgba(0,229,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "22px",
            boxShadow: "0 18px 45px rgba(0,229,255,0.08)",
          }}
        >
          <Network size={28} strokeWidth={1.8} color="#67e8f9" />
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.85rem)",
            fontWeight: 850,
            marginBottom: "12px",
            letterSpacing: "-0.035em",
          }}
        >
          System Design
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "720px",
            lineHeight: 1.75,
          }}
        >
          Learn how production AI systems are planned, designed, evaluated, and
          scaled using prompts, retrieval, tools, agents, and monitoring.
        </p>
      </section>

      {/* Stats */}
      <section
        className="system-design-hero-card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          padding: "24px",
          marginBottom: "34px",
          borderRadius: "24px",
          border: "1px solid rgba(0,229,255,0.18)",
          background:
            "linear-gradient(135deg, rgba(0,229,255,0.08), rgba(124,58,237,0.08))",
        }}
      >
        {[
          {
            label: "Core Modules",
            value: "5",
            icon: Layers,
          },
          {
            label: "Architecture Flow",
            value: "End-to-End",
            icon: GitBranch,
          },
          {
            label: "Focus",
            value: "Production AI",
            icon: Server,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="glass-card system-stat-card"
              style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background: "rgba(0,229,255,0.1)",
                  border: "1px solid rgba(0,229,255,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} strokeWidth={1.8} color="#67e8f9" />
              </div>

              <div>
                <div
                  style={{
                    color: "#60a5fa",
                    fontWeight: 850,
                    fontSize: item.value.length > 3 ? "1rem" : "1.45rem",
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.82rem",
                    marginTop: "4px",
                  }}
                >
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Architecture Flow */}
      <section style={{ marginBottom: "38px" }}>
        <div style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            AI System Architecture Flow
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.92rem",
              lineHeight: 1.7,
            }}
          >
            A simple production-style flow used in many LLM applications.
          </p>
        </div>

        <div
          className="system-flow-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "14px",
          }}
        >
          {architectureFlow.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="glass-card system-flow-card"
                style={{
                  padding: "20px",
                  position: "relative",
                  minHeight: "175px",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "14px",
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.14), rgba(124,58,237,0.16))",
                    border: "1px solid rgba(0,229,255,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Icon size={19} strokeWidth={1.8} color="#a5f3fc" />
                </div>

                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  0{index + 1}
                </span>

                <h3
                  style={{
                    fontSize: "0.96rem",
                    fontWeight: 750,
                    marginBottom: "8px",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.82rem",
                    lineHeight: 1.65,
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 0.85fr",
          gap: "22px",
          alignItems: "start",
        }}
        className="system-main-grid"
      >
        {/* Articles */}
        <div>
          <div style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              Architecture Learning Modules
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.92rem",
                lineHeight: 1.7,
              }}
            >
              Start with these modules to understand how AI systems are built.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {articles.map((article) => {
              const Icon = article.icon;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="glass-card system-article-card"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "24px 26px",
                    display: "flex",
                    gap: "18px",
                    alignItems: "flex-start",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      background: `linear-gradient(135deg, ${article.accent}33, rgba(124,58,237,0.18))`,
                      border: `1px solid ${article.accent}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} strokeWidth={1.8} color={article.accent} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          background: "rgba(0,229,255,0.08)",
                          color: "#67e8f9",
                          border: "1px solid rgba(0,229,255,0.14)",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {article.level}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "1.08rem",
                        fontWeight: 750,
                        marginBottom: "8px",
                        lineHeight: 1.35,
                      }}
                    >
                      {article.title}
                    </h3>

                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: 1.65,
                      }}
                    >
                      {article.excerpt}
                    </p>
                  </div>

                  <ArrowRight
                    size={19}
                    strokeWidth={1.8}
                    style={{
                      color: "var(--text-muted)",
                      flexShrink: 0,
                      marginTop: "8px",
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Checklist */}
        <aside
          className="glass-card system-checklist-card"
          style={{
            padding: "24px",
            border: "1px solid rgba(124,58,237,0.18)",
            position: "sticky",
            top: "96px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "16px",
              background: "rgba(124,58,237,0.14)",
              border: "1px solid rgba(124,58,237,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Zap size={21} strokeWidth={1.8} color="#c4b5fd" />
          </div>

          <h2
            style={{
              fontSize: "1.08rem",
              fontWeight: 800,
              marginBottom: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            Design Checklist
          </h2>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.86rem",
              lineHeight: 1.65,
              marginBottom: "18px",
            }}
          >
            Use this checklist while explaining AI system design in interviews
            or project reviews.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {checklist.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "var(--text-secondary)",
                  fontSize: "0.86rem",
                  lineHeight: 1.55,
                }}
              >
                <CheckCircle
                  size={16}
                  strokeWidth={1.9}
                  color="#34d399"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/playground"
            className="btn-primary"
            style={{
              marginTop: "22px",
              width: "100%",
              justifyContent: "center",
              fontSize: "0.88rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            Try in Playground
            <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
        </aside>
      </section>
    </div>
  );
}
