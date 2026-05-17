"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Inbox } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  difficulty: string;
  tags: string[];
  created_at: string;
}

interface ArticlesClientProps {
  articles: Article[];
  categories: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBadgeClass(difficulty: string) {
  return `badge badge-${difficulty}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ArticlesClient({
  articles,
  categories,
}: ArticlesClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <>
      {/* ── Category Filter Bar ── */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "34px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "9px 20px",
                borderRadius: "12px",
                border: isActive
                  ? "1px solid rgba(0, 229, 255, 0.45)"
                  : "1px solid var(--border-medium)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(0,229,255,0.16), rgba(124,58,237,0.18))"
                  : "rgba(255,255,255,0.02)",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: "0.84rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s ease",
                outline: "none",
                boxShadow: isActive
                  ? "0 0 24px rgba(0,229,255,0.08)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-medium)";
                }
              }}
            >
              {cat}
            </button>
          );
        })}

        {/* Article count */}
        <span
          style={{
            marginLeft: "auto",
            color: "var(--text-muted)",
            fontSize: "0.84rem",
            alignSelf: "center",
            letterSpacing: "0.02em",
          }}
        >
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Article Cards ── */}
      {filtered.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "64px 32px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              margin: "0 auto 18px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.14))",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Inbox size={26} strokeWidth={1.8} />
          </div>

          <p style={{ fontSize: "1rem" }}>
            No articles in this category yet. Check back soon!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {filtered.map((article, index) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              id={`article-${article.slug}`}
              className="glass-card animate-fade-in-up"
              style={{
                padding: "28px 32px",
                textDecoration: "none",
                color: "inherit",
                opacity: 0,
                animationDelay: `${index * 0.08}s`,
                display: "block",
                border: "1px solid rgba(255,255,255,0.07)",
                transition:
                  "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(0,229,255,0.28)";
                e.currentTarget.style.background = "rgba(255,255,255,0.045)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "";
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "18px",
                }}
              >
                {/* Small icon box */}
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "13px",
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.14))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <FileText size={19} strokeWidth={1.8} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Difficulty + Category badges */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "11px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span className={getBadgeClass(article.difficulty)}>
                      {article.difficulty}
                    </span>

                    <span
                      style={{
                        fontSize: "0.74rem",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.05)",
                        color: "var(--text-muted)",
                        textTransform: "capitalize",
                      }}
                    >
                      {article.category}
                    </span>

                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.74rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(article.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.14rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                      lineHeight: 1.4,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Tags row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.7rem",
                          padding: "3px 10px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.04)",
                          color: "var(--text-muted)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.03)",
                    color: "var(--text-muted)",
                    flexShrink: 0,
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowRight size={17} strokeWidth={1.8} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
