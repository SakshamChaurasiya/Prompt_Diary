import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Layers3, Trophy } from "lucide-react";
import { serverListChallenges, type ApiChallenge } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Challenges — Prompt Diary",
  description:
    "Practice writing effective prompts with hands-on challenges. From summarization to multi-step reasoning.",
};

const FALLBACK: ApiChallenge[] = [
  {
    id: "ch-001",
    title: "Summarize an Article",
    description:
      "Write a prompt that instructs an AI to summarize a long technical article into 3 key bullet points.",
    difficulty: "easy",
    category: "summarization",
    points: 10,
    starter_prompt: "Summarize the following article...",
    hints: [],
    created_at: "",
  },
  {
    id: "ch-002",
    title: "Extract JSON from Text",
    description:
      "Write a prompt that extracts structured JSON data from an unstructured product review.",
    difficulty: "medium",
    category: "extraction",
    points: 20,
    starter_prompt: "Extract the following information...",
    hints: [],
    created_at: "",
  },
  {
    id: "ch-003",
    title: "Multi-Step Reasoning",
    description:
      "Write a prompt that guides the AI through a multi-step math word problem with step-by-step work.",
    difficulty: "medium",
    category: "reasoning",
    points: 20,
    starter_prompt: "Solve the following problem step by step...",
    hints: [],
    created_at: "",
  },
  {
    id: "ch-004",
    title: "Role-Based Prompt Design",
    description:
      "Create a system prompt that makes the AI act as a senior code reviewer with actionable feedback.",
    difficulty: "hard",
    category: "role-playing",
    points: 30,
    starter_prompt: "You are a senior software engineer...",
    hints: [],
    created_at: "",
  },
  {
    id: "ch-005",
    title: "Build a Prompt Chain",
    description:
      "Design 3 connected prompts: analyze, generate solutions, then evaluate and rank.",
    difficulty: "hard",
    category: "chaining",
    points: 40,
    starter_prompt: "Step 1: Analyze the following...",
    hints: [],
    created_at: "",
  },
];

export default async function ChallengesPage() {
  const api = await serverListChallenges();
  const challenges =
    api?.challenges?.length && api.challenges.every((c) => c.id && c.title)
      ? api.challenges
      : FALLBACK;

  const totalPoints = challenges.reduce((sum, challenge) => {
    return sum + (challenge.points || 0);
  }, 0);
  const difficulties = new Set(challenges.map((challenge) => challenge.difficulty)).size;
  const stats = [
    { label: "Total Challenges", value: String(challenges.length), icon: Layers3 },
    { label: "Total Points", value: String(totalPoints), icon: Trophy },
    { label: "Difficulties", value: String(difficulties), icon: CheckCircle2 },
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
          Prompt Challenges
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "640px",
            lineHeight: 1.7,
          }}
        >
          Practice writing effective prompts. Earn points and track your progress.
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

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {challenges.map((challenge, index) => (
          <div
            key={challenge.id}
            id={`challenge-${challenge.id}`}
            className="glass-card challenge-card animate-fade-in-up"
            style={{
              padding: "28px 32px",
              opacity: 0,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "18px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span className={`badge badge-${challenge.difficulty}`}>
                    {challenge.difficulty}
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
                    {challenge.category}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {challenge.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    maxWidth: "680px",
                  }}
                >
                  {challenge.description}
                </p>
              </div>

              <div
                style={{
                  minWidth: "82px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: "1.45rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                  className="gradient-text"
                >
                  {challenge.points}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  POINTS
                </div>
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <Link
                href={`/challenges/${challenge.id}`}
                className="btn-secondary challenge-action"
                style={{
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Start Challenge
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
