"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Target,
  Map,
  Loader2,
  FileSearch,
  ArrowRight,
} from "lucide-react";
import { searchContent } from "@/lib/api";

interface SearchResult {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    difficulty: string;
  }>;
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    points: number;
  }>;
  roadmaps: Array<{
    id: string;
    title: string;
    description: string;
    level: string;
    estimated_hours: number;
  }>;
  total: number;
}

type FilterType = "all" | "articles" | "challenges" | "roadmaps";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (
    e?: React.FormEvent,
    nextFilter?: FilterType
  ) => {
    e?.preventDefault();

    const activeFilter = nextFilter ?? filter;

    if (query.trim().length < 2) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchContent(
        query.trim(),
        activeFilter === "all" ? undefined : activeFilter
      );
      setResults(data);
    } catch {
      setResults({ articles: [], challenges: [], roadmaps: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const difficultyColors: Record<string, string> = {
    beginner: "#10b981",
    easy: "#10b981",
    intermediate: "#3b82f6",
    medium: "#f59e0b",
    advanced: "#ef4444",
    hard: "#ef4444",
  };

  const tabs = [
    { key: "all", label: "All", icon: Search },
    { key: "articles", label: "Articles", icon: BookOpen },
    { key: "challenges", label: "Challenges", icon: Target },
    { key: "roadmaps", label: "Roadmaps", icon: Map },
  ] as const;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(0,229,255,0.1)",
            border: "1px solid rgba(0,229,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            color: "#00e5ff",
          }}
        >
          <Search size={26} strokeWidth={1.8} />
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Search
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "600px",
            lineHeight: 1.7,
          }}
        >
          Find articles, challenges, and roadmaps across the platform.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            strokeWidth={1.8}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />

          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for topics, techniques, architectures..."
            style={{
              width: "100%",
              padding: "14px 20px 14px 46px",
              borderRadius: "12px",
              border: "1px solid var(--border-medium)",
              background: "rgba(0,0,0,0.3)",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(0,229,255,0.5)";
              e.target.style.boxShadow = "0 0 0 4px rgba(0,229,255,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "";
              e.target.style.boxShadow = "";
            }}
          />
        </div>

        <button
          type="submit"
          id="search-submit"
          className="btn-primary"
          disabled={loading || query.trim().length < 2}
          style={{
            padding: "14px 28px",
            fontSize: "0.9rem",
            opacity: loading || query.trim().length < 2 ? 0.5 : 1,
            cursor:
              loading || query.trim().length < 2 ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin-icon" />
              Searching
            </>
          ) : (
            <>
              Search
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = filter === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                if (searched) handleSearch(undefined, tab.key);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: `1px solid ${
                  active ? "rgba(0,229,255,0.5)" : "var(--border-subtle)"
                }`,
                background: active ? "rgba(0,229,255,0.1)" : "transparent",
                color: active ? "#00e5ff" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon size={15} strokeWidth={1.8} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Loader2
            size={34}
            className="spin-icon"
            style={{ color: "#00e5ff", marginBottom: "14px" }}
          />
          <p style={{ color: "var(--text-muted)" }}>Searching...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && results && (
        <div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            {results.total} result{results.total !== 1 ? "s" : ""} found for
            &ldquo;{query}&rdquo;
          </p>

          {/* Articles Results */}
          {results.articles.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <SectionTitle
                icon={<BookOpen size={16} strokeWidth={1.8} />}
                title={`Articles (${results.articles.length})`}
              />

              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {results.articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="glass-card"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      padding: "18px 22px",
                      display: "block",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "6px",
                        alignItems: "center",
                      }}
                    >
                      <span className={`badge badge-${article.difficulty}`}>
                        {article.difficulty}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                          textTransform: "capitalize",
                        }}
                      >
                        {article.category}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {article.title}
                    </h4>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {article.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Results */}
          {results.challenges.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <SectionTitle
                icon={<Target size={16} strokeWidth={1.8} />}
                title={`Challenges (${results.challenges.length})`}
              />

              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {results.challenges.map((challenge) => (
                  <Link
                    key={challenge.id}
                    href={`/challenges/${challenge.id}`}
                    className="glass-card"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      padding: "18px 22px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "6px",
                          alignItems: "center",
                        }}
                      >
                        <span className={`badge badge-${challenge.difficulty}`}>
                          {challenge.difficulty}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            textTransform: "capitalize",
                          }}
                        >
                          {challenge.category}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        {challenge.title}
                      </h4>

                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {challenge.description}
                      </p>
                    </div>

                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div
                        className="gradient-text"
                        style={{ fontSize: "1.2rem", fontWeight: 700 }}
                      >
                        {challenge.points}
                      </div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        PTS
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Roadmaps Results */}
          {results.roadmaps.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <SectionTitle
                icon={<Map size={16} strokeWidth={1.8} />}
                title={`Roadmaps (${results.roadmaps.length})`}
              />

              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {results.roadmaps.map((roadmap) => (
                  <Link
                    key={roadmap.id}
                    href={`/roadmaps#roadmap-${roadmap.id}`}
                    className="glass-card"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      padding: "18px 22px",
                      display: "block",
                      borderLeft: `3px solid ${
                        difficultyColors[roadmap.level] || "#6b7280"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span className={`badge badge-${roadmap.level}`}>
                        {roadmap.level}
                      </span>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        ~{roadmap.estimated_hours} hours
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {roadmap.title}
                    </h4>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {roadmap.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {results.total === 0 && (
            <div
              className="glass-card"
              style={{
                textAlign: "center",
                padding: "48px 24px",
              }}
            >
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "var(--text-muted)",
                }}
              >
                <FileSearch size={28} strokeWidth={1.7} />
              </div>

              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                No results found
              </h3>

              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Try different keywords or browse our{" "}
                <Link
                  href="/articles"
                  style={{ color: "#a78bfa", textDecoration: "none" }}
                >
                  articles
                </Link>{" "}
                directly.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div
          className="glass-card"
          style={{
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#00e5ff",
            }}
          >
            <Search size={30} strokeWidth={1.7} />
          </div>

          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            Search the Platform
          </h3>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Search across articles, challenges, and roadmaps to find exactly
            what you need.
          </p>
        </div>
      )}

      <style jsx global>{`
        .spin-icon {
          animation: search-spin 0.9s linear infinite;
        }

        @keyframes search-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          form {
            flex-direction: column;
          }

          #search-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h3
      style={{
        fontSize: "0.9rem",
        fontWeight: 700,
        color: "var(--text-secondary)",
        marginBottom: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ color: "#00e5ff", display: "inline-flex" }}>{icon}</span>
      {title}
    </h3>
  );
}
