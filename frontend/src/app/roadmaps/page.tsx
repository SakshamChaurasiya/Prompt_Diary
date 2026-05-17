import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Layers3,
  Map,
  Route,
} from "lucide-react";
import {
  roadmapTopicsToStrings,
  serverListRoadmaps,
  type ApiRoadmap,
} from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Roadmaps — Prompt Diary",
  description:
    "Structured learning paths from beginner to advanced for prompt engineering and AI systems.",
};

const LEVEL_STYLE: Record<string, { color: string; gradient: string }> = {
  beginner: {
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
  },
  intermediate: {
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  },
  advanced: {
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #ec4899)",
  },
};

const FALLBACK: ApiRoadmap[] = [
  {
    id: "rm-001",
    title: "Prompt Engineering Beginner Path",
    level: "beginner",
    description:
      "Start your journey. Learn the fundamentals of LLMs and how to craft effective prompts.",
    topics: [
      "What are LLMs?",
      "Prompt Basics",
      "Zero-Shot Prompting",
      "Few-Shot Prompting",
      "Prompt Formatting",
      "Common Mistakes",
    ],
    estimated_hours: 8,
  },
  {
    id: "rm-002",
    title: "Intermediate Prompt Techniques",
    level: "intermediate",
    description:
      "Level up with advanced techniques like Chain-of-Thought, role prompting, and prompt chaining.",
    topics: [
      "Chain-of-Thought",
      "Role Prompting",
      "Output Formatting",
      "Prompt Chaining",
      "Temperature & Parameters",
      "Evaluation",
    ],
    estimated_hours: 12,
  },
  {
    id: "rm-003",
    title: "Advanced AI Architecture",
    level: "advanced",
    description:
      "Master production AI systems, RAG pipelines, agent architectures, and enterprise workflows.",
    topics: [
      "RAG Architecture",
      "Vector Databases",
      "AI Agents",
      "Multi-Agent Systems",
      "Enterprise AI",
      "AI Safety",
    ],
    estimated_hours: 20,
  },
];

export default async function RoadmapsPage() {
  const api = await serverListRoadmaps();
  const roadmaps =
    api?.roadmaps?.length && api.roadmaps.every((r) => r.id && r.title)
      ? api.roadmaps
      : FALLBACK;

  const totalTopics = roadmaps.reduce((sum, roadmap) => {
    return sum + roadmapTopicsToStrings(roadmap.topics).length;
  }, 0);
  const totalHours = roadmaps.reduce((sum, roadmap) => {
    return sum + (roadmap.estimated_hours || 0);
  }, 0);
  const stats = [
    { label: "Learning Paths", value: String(roadmaps.length), icon: Route },
    { label: "Total Topics", value: String(totalTopics), icon: Layers3 },
    { label: "Guided Hours", value: String(totalHours), icon: Clock3 },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: "46px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-0.03em",
          }}
        >
          Learning Roadmaps
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "640px",
            lineHeight: 1.7,
          }}
        >
          Structured learning paths to take you from beginner to expert. Follow step by step.
        </p>
      </div>

      <div
        className="glass-card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          padding: "22px",
          marginBottom: "34px",
          gap: "14px",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              style={{
                padding: "18px 16px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
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
                }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <div>
                <div
                  style={{ fontSize: "1.45rem", fontWeight: 800 }}
                  className="gradient-text"
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {roadmaps.map((roadmap, index) => {
          const style = LEVEL_STYLE[roadmap.level] ?? LEVEL_STYLE.beginner;
          const topicLabels = roadmapTopicsToStrings(roadmap.topics);

          return (
            <div
              key={roadmap.id}
              id={`roadmap-${roadmap.id}`}
              className="glass-card roadmap-card animate-fade-in-up"
              style={{
                padding: "34px",
                opacity: 0,
                animationDelay: `${index * 0.15}s`,
                borderLeft: `3px solid ${style.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "18px",
                  marginBottom: "22px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className={`badge badge-${roadmap.level}`}>
                      {roadmap.level}
                    </span>

                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Clock3 size={14} strokeWidth={1.8} />~
                      {roadmap.estimated_hours ?? 0} hours
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      marginBottom: "8px",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {roadmap.title}
                  </h3>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                      maxWidth: "760px",
                    }}
                  >
                    {roadmap.description}
                  </p>
                </div>

                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: style.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 16px 40px ${style.color}33`,
                    flexShrink: 0,
                  }}
                >
                  {roadmap.level === "beginner" ? (
                    <BookOpenCheck size={25} strokeWidth={1.8} />
                  ) : roadmap.level === "intermediate" ? (
                    <Map size={25} strokeWidth={1.8} />
                  ) : (
                    <CheckCircle2 size={25} strokeWidth={1.8} />
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                  marginBottom: "24px",
                }}
              >
                {topicLabels.map((topic, i) => (
                  <div
                    key={`${roadmap.id}-${i}-${topic}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.055)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "9px",
                        background: style.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>

                    <span style={{ color: "var(--text-secondary)" }}>{topic}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/articles"
                className="btn-primary roadmap-action"
                style={{
                  padding: "10px 22px",
                  fontSize: "0.9rem",
                  background: style.gradient,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                Start Learning
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
