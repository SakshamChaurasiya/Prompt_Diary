"use client";

import { useState, useEffect } from "react";
import { runPrompt, getPlaygroundModels } from "@/lib/api";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronDown,
  ClipboardList,
  Clock3,
  Eraser,
  FileInput,
  FileOutput,
  Gauge,
  Lightbulb,
  Loader2,
  Play,
  Settings2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  available: boolean;
  description: string;
}

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [lastUsage, setLastUsage] = useState<{
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    latency_ms: number;
  } | null>(null);

  useEffect(() => {
    async function loadModels() {
      try {
        const data = await getPlaygroundModels();
        if (data?.models) {
          setModels(data.models);
        }
      } catch {
        // Use defaults when backend is not available
      }
    }

    loadModels();
  }, []);

  const handleRun = async () => {
    if (!prompt.trim()) return;

    setIsRunning(true);
    setOutput("");
    setLastUsage(null);

    try {
      const data = await runPrompt({
        prompt: prompt.trim(),
        model,
        temperature,
        system_prompt: systemPrompt.trim() || undefined,
      });

      if (data?.success) {
        setOutput(data.response);
        setLastUsage({
          input_tokens: data.usage?.input_tokens || 0,
          output_tokens: data.usage?.output_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0,
          latency_ms: data.latency_ms || 0,
        });
      } else {
        setOutput("Error: Failed to get response from the API.");
      }
    } catch {
      // Fallback: simulate locally if backend is not available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOutput(
        `[Simulated Response from ${model}]\n\nThe backend API is not reachable. This is a local fallback response.\n\nYour prompt was:\n"${prompt}"\n\n---\nTokens used: ~${Math.floor(
          prompt.length / 4
        )} input + ~50 output\nModel: ${model}\nLatency: 1.0s (simulated)`
      );

      setLastUsage({
        input_tokens: Math.floor(prompt.length / 4),
        output_tokens: 50,
        total_tokens: Math.floor(prompt.length / 4) + 50,
        latency_ms: 1000,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setOutput("");
    setLastUsage(null);
    setSystemPrompt("");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "34px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-0.03em",
          }}
        >
          Prompt Playground
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "680px",
            lineHeight: 1.7,
          }}
        >
          Test, refine, and compare prompts with model settings and instant
          output preview.
        </p>
      </div>

      {/* Controls Bar */}
      <div
        className="glass-card playground-control-card"
        style={{
          padding: "18px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          {/* Model Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Bot size={15} strokeWidth={1.8} />
              Model
            </label>

            <select
              id="model-selector"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                padding: "8px 34px 8px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(0,229,255,0.18)",
                background: "rgba(0,0,0,0.28)",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {models.length > 0 ? (
                models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))
              ) : (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="claude-3">Claude 3</option>
                  <option value="llama-3">Llama 3</option>
                </>
              )}
            </select>
          </div>

          {/* Temperature */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Gauge size={15} strokeWidth={1.8} />
              Temp
            </label>

            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: "90px", cursor: "pointer" }}
            />

            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                minWidth: "26px",
                fontWeight: 700,
              }}
            >
              {temperature}
            </span>
          </div>

          {/* Settings toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: "8px 13px",
              borderRadius: "10px",
              border: showSettings
                ? "1px solid rgba(0,229,255,0.35)"
                : "1px solid var(--border-subtle)",
              background: showSettings ? "rgba(0,229,255,0.1)" : "transparent",
              color: showSettings ? "#67e8f9" : "var(--text-secondary)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Settings2 size={15} strokeWidth={1.8} />
            System Prompt
            <ChevronDown
              size={15}
              strokeWidth={1.8}
              style={{
                transition: "transform 0.2s ease",
                transform: showSettings ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleClear}
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              fontSize: "0.8rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Eraser size={15} strokeWidth={1.8} />
            Clear
          </button>

          <button
            id="run-prompt"
            onClick={handleRun}
            disabled={isRunning || !prompt.trim()}
            className="btn-primary"
            style={{
              padding: "8px 20px",
              fontSize: "0.85rem",
              opacity: isRunning || !prompt.trim() ? 0.5 : 1,
              cursor: isRunning || !prompt.trim() ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isRunning ? (
              <>
                <Loader2
                  size={15}
                  strokeWidth={1.8}
                  style={{ animation: "orbit 0.8s linear infinite" }}
                />
                Running
              </>
            ) : (
              <>
                <Play size={15} strokeWidth={1.8} />
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* System Prompt */}
      {showSettings && (
        <div
          className="glass-card animate-slide-down playground-system-card"
          style={{
            padding: "18px 20px",
            marginBottom: "20px",
            border: "1px solid rgba(124,58,237,0.18)",
          }}
        >
          <label
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <SlidersHorizontal size={15} strokeWidth={1.8} />
            System Prompt (optional)
          </label>

          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful AI assistant..."
            style={{
              width: "100%",
              padding: "13px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.34), rgba(15,23,42,0.18))",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              lineHeight: 1.55,
              resize: "vertical",
              outline: "none",
              fontFamily: "var(--font-geist-mono), monospace",
              minHeight: "72px",
              maxHeight: "160px",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          minHeight: "450px",
        }}
        className="playground-grid"
      >
        {/* Input Panel */}
        <div
          className="glass-card playground-panel"
          style={{
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(0,229,255,0.16)",
          }}
        >
          <h3
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              marginBottom: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <FileInput size={16} strokeWidth={1.8} />
            Prompt Input
          </h3>

          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleRun();
              }
            }}
            placeholder={`Enter your prompt here...\n\nExamples:\n• Summarize this article into 3 bullet points\n• Extract JSON from this product review\n• Explain RAG architecture step by step\n\nTip: Press Ctrl+Enter to run`}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "14px",
              border: prompt
                ? "1px solid rgba(0,229,255,0.34)"
                : "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.34), rgba(15,23,42,0.18))",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              lineHeight: 1.65,
              resize: "none",
              outline: "none",
              fontFamily: "var(--font-geist-mono), monospace",
              minHeight: "300px",
              boxShadow: prompt ? "0 0 0 3px rgba(0,229,255,0.06)" : "none",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ClipboardList size={14} strokeWidth={1.8} />
              {prompt.length} characters · ~{Math.ceil(prompt.length / 4)} tokens
            </span>

            <span>Ctrl+Enter to run</span>
          </div>
        </div>

        {/* Output Panel */}
        <div
          className="glass-card playground-panel"
          style={{
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(124,58,237,0.18)",
          }}
        >
          <h3
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              marginBottom: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <FileOutput size={16} strokeWidth={1.8} />
            Output
          </h3>

          <div
            id="prompt-output"
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.34), rgba(15,23,42,0.18))",
              border: output
                ? "1px solid rgba(124,58,237,0.34)"
                : "1px solid rgba(255,255,255,0.08)",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              color: output ? "var(--text-primary)" : "var(--text-muted)",
              whiteSpace: "pre-wrap",
              overflow: "auto",
              minHeight: "300px",
              boxShadow: output ? "0 0 0 3px rgba(124,58,237,0.06)" : "none",
            }}
          >
            {isRunning ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Loader2
                  size={17}
                  strokeWidth={1.8}
                  style={{ animation: "orbit 0.8s linear infinite" }}
                />
                <span>Generating response...</span>
              </div>
            ) : output ? (
              output
            ) : (
              "Output will appear here after you run a prompt.\n\nTip: Try different models and compare results!"
            )}
          </div>

          {/* Usage Stats */}
          {lastUsage && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "12px",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                flexWrap: "wrap",
              }}
            >
              <span className="usage-pill">
                <FileInput size={13} strokeWidth={1.8} />
                {lastUsage.input_tokens} input
              </span>
              <span className="usage-pill">
                <FileOutput size={13} strokeWidth={1.8} />
                {lastUsage.output_tokens} output
              </span>
              <span className="usage-pill">
                <BrainCircuit size={13} strokeWidth={1.8} />
                {lastUsage.total_tokens} total
              </span>
              <span className="usage-pill">
                <Clock3 size={13} strokeWidth={1.8} />
                {lastUsage.latency_ms}ms
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div
        className="glass-card playground-info-card"
        style={{
          marginTop: "20px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          border: "1px solid rgba(251,191,36,0.16)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "12px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Lightbulb size={17} strokeWidth={1.8} color="#fbbf24" />
        </div>

        <span style={{ lineHeight: 1.7 }}>
          <strong style={{ color: "var(--text-secondary)" }}>
            Smart Responses:
          </strong>{" "}
          The playground generates context-aware simulated responses. Try prompts
          about summarization, JSON extraction, code generation, or explanations
          for varied outputs. Real LLM integration with OpenAI, Gemini, and
          HuggingFace can be added in Phase 4.
        </span>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .playground-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
