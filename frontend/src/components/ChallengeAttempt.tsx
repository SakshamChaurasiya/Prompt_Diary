"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Eraser,
  FileText,
  Lightbulb,
  PartyPopper,
  PenLine,
  Send,
} from "lucide-react";

interface Hint {
  text: string;
}

interface ChallengeAttemptProps {
  challengeId: string;
  title: string;
  exampleContext: string;
  expectedOutput: string;
  hints: Hint[];
  points: number;
  difficulty: string;
}

export default function ChallengeAttempt({
  exampleContext,
  expectedOutput,
  hints,
  points,
  difficulty,
}: ChallengeAttemptProps) {
  const [prompt, setPrompt] = useState("");
  const [hintsOpen, setHintsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const difficultyColor: Record<string, string> = {
    easy: "#34d399",
    medium: "#fbbf24",
    hard: "#f87171",
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = () => {
    if (prompt.trim().length < 10) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setPrompt("");
    setCharCount(0);
    setSubmitted(false);
  };

  const currentDifficultyColor = difficultyColor[difficulty] || "#a78bfa";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Context / Input */}
      <div
        className="glass-card"
        style={{
          padding: "24px 28px",
          border: "1px solid rgba(0,229,255,0.16)",
          boxShadow: "0 18px 55px rgba(0,0,0,0.18)",
        }}
      >
        <h2
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FileText size={16} strokeWidth={1.8} />
          Context / Input
        </h2>

        <div
          style={{
            background: "rgba(0,0,0,0.32)",
            borderRadius: "12px",
            padding: "16px 20px",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.83rem",
            lineHeight: 1.75,
            color: "#cbd5e1",
            whiteSpace: "pre-wrap",
          }}
        >
          {exampleContext}
        </div>
      </div>

      {/* Expected Output */}
      <div
        className="glass-card"
        style={{
          padding: "24px 28px",
          border: "1px solid rgba(16,185,129,0.18)",
          boxShadow: "0 18px 55px rgba(0,0,0,0.18)",
        }}
      >
        <h2
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={16} strokeWidth={1.8} />
          Expected Output Format
        </h2>

        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(0,229,255,0.035))",
            borderRadius: "12px",
            padding: "16px 20px",
            border: "1px solid rgba(16,185,129,0.18)",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.83rem",
            lineHeight: 1.75,
            color: "#6ee7b7",
            whiteSpace: "pre-wrap",
          }}
        >
          {expectedOutput}
        </div>
      </div>

      {/* Hints */}
      <div
        className="glass-card"
        style={{
          padding: 0,
          overflow: "hidden",
          border: "1px solid rgba(245,158,11,0.16)",
        }}
      >
        <button
          onClick={() => setHintsOpen(!hintsOpen)}
          style={{
            width: "100%",
            padding: "18px 28px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#fbbf24",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <Lightbulb size={17} strokeWidth={1.8} />
            Show Hints ({hints.length})
          </span>

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            style={{
              transition: "transform 0.2s ease",
              transform: hintsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {hintsOpen && (
          <div
            style={{
              padding: "0 28px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {hints.map((hint, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  background: "rgba(251,191,36,0.055)",
                  borderRadius: "10px",
                  border: "1px solid rgba(251,191,36,0.13)",
                }}
              >
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "8px",
                    background: "rgba(251,191,36,0.12)",
                    color: "#fbbf24",
                    fontWeight: 800,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {i + 1}
                </span>

                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                  }}
                >
                  {hint.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Editor */}
      <div
        className="glass-card"
        style={{
          padding: "24px 28px",
          border: `1px solid ${
            prompt.length > 10 ? "rgba(124,58,237,0.34)" : "rgba(255,255,255,0.08)"
          }`,
          boxShadow:
            prompt.length > 10
              ? "0 0 35px rgba(124,58,237,0.08), 0 18px 55px rgba(0,0,0,0.2)"
              : "0 18px 55px rgba(0,0,0,0.16)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <h2
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PenLine size={16} strokeWidth={1.8} />
            Your Prompt
          </h2>

          <span
            style={{
              fontSize: "0.75rem",
              color: charCount > 50 ? "#34d399" : "var(--text-muted)",
            }}
          >
            {charCount} characters
          </span>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "24px",
                margin: "0 auto 18px",
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(0,229,255,0.14))",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 35px rgba(0,229,255,0.1)",
              }}
            >
              <PartyPopper size={34} strokeWidth={1.8} />
            </div>

            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              Prompt Submitted!
            </h3>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "8px",
              }}
            >
              Great work! You earned
            </p>

            <div
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                marginBottom: "20px",
              }}
              className="gradient-text"
            >
              +{points} pts
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginBottom: "24px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                maxWidth: "560px",
                lineHeight: 1.6,
              }}
            >
              <AlertTriangle
                size={15}
                strokeWidth={1.8}
                color={currentDifficultyColor}
                style={{ flexShrink: 0 }}
              />
              Auto-evaluation coming in Phase 4. A human reviewer or LLM will
              grade your prompt.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleReset}
                className="btn-secondary"
                style={{
                  fontSize: "0.85rem",
                  padding: "10px 22px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Eraser size={15} strokeWidth={1.8} />
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <textarea
              value={prompt}
              onChange={handleChange}
              placeholder={`Write your prompt here...\n\nExample: "You are an expert summarizer. Given the following text, extract exactly 3 key bullet points..."`}
              style={{
                width: "100%",
                minHeight: "190px",
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.34), rgba(15,23,42,0.18))",
                border: `1px solid ${
                  prompt.length > 10
                    ? "rgba(124,58,237,0.46)"
                    : "rgba(255,255,255,0.08)"
                }`,
                borderRadius: "12px",
                padding: "16px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
                boxShadow:
                  prompt.length > 10 ? "0 0 0 3px rgba(124,58,237,0.08)" : "none",
              }}
            />

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <ClipboardList size={15} strokeWidth={1.8} />
                Minimum 10 characters required
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {prompt.length > 0 && (
                  <button
                    onClick={() => {
                      setPrompt("");
                      setCharCount(0);
                    }}
                    style={{
                      padding: "10px 20px",
                      background: "transparent",
                      border: "1px solid var(--border-medium)",
                      borderRadius: "10px",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Eraser size={15} strokeWidth={1.8} />
                    Clear
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={prompt.trim().length < 10}
                  className="btn-primary"
                  style={{
                    padding: "10px 24px",
                    fontSize: "0.9rem",
                    opacity: prompt.trim().length < 10 ? 0.5 : 1,
                    cursor: prompt.trim().length < 10 ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Submit Prompt
                  <Send size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
