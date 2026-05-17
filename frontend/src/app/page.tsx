import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ModuleCard from "@/components/ModuleCard";
import Link from "next/link";
import {
  Puzzle,
  Zap,
  GitBranch,
  Network,
  Bot,
  Repeat2,
  Theater,
  TableProperties,
  Search,
  ShieldCheck,
  TrendingUp,
  Globe2,
} from "lucide-react";

export default function Home() {
  const topics = [
    {
      Icon: Puzzle,
      topic: "Prompt Engineering",
      tag: "fundamentals",
    },
    {
      Icon: Zap,
      topic: "Zero/Few-Shot",
      tag: "techniques",
    },
    {
      Icon: GitBranch,
      topic: "Chain-of-Thought",
      tag: "techniques",
    },
    {
      Icon: Network,
      topic: "RAG Architecture",
      tag: "architecture",
    },
    {
      Icon: Bot,
      topic: "AI Agents",
      tag: "architecture",
    },
    {
      Icon: Repeat2,
      topic: "Prompt Chaining",
      tag: "techniques",
    },
    {
      Icon: Theater,
      topic: "Role Prompting",
      tag: "techniques",
    },
    {
      Icon: TableProperties,
      topic: "Output Formatting",
      tag: "techniques",
    },
    {
      Icon: Search,
      topic: "Vector Search",
      tag: "architecture",
    },
    {
      Icon: ShieldCheck,
      topic: "AI Safety",
      tag: "architecture",
    },
    {
      Icon: TrendingUp,
      topic: "Evaluation",
      tag: "techniques",
    },
    {
      Icon: Globe2,
      topic: "Enterprise AI",
      tag: "architecture",
    },
  ];

  return (
    <>
      {/* Hero Section — with full-screen video background */}
      <Hero />

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: "40px 24px 100px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            Everything You Need to{" "}
            <span className="gradient-text-secondary">Master AI</span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            From fundamentals to advanced architectures — learn, practice, and
            build with AI.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          <FeatureCard
            icon="📚"
            title="Learning Articles"
            description="In-depth articles on prompt engineering, AI architectures, agent systems, and LLM workflows."
            href="/articles"
            gradient="linear-gradient(135deg, #7c3aed, #a78bfa)"
            delay="delay-100"
          />
          <FeatureCard
            icon="🎯"
            title="Prompt Challenges"
            description="Practice writing effective prompts with hands-on challenges. From summarization to multi-step reasoning."
            href="/challenges"
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
            delay="delay-200"
          />
          <FeatureCard
            icon="🗺️"
            title="Learning Roadmaps"
            description="Structured learning paths from beginner to advanced. Know exactly what to learn and in what order."
            href="/roadmaps"
            gradient="linear-gradient(135deg, #06b6d4, #22d3ee)"
            delay="delay-300"
          />
          <FeatureCard
            icon="🧪"
            title="Prompt Playground"
            description="Interactive environment to test and iterate on your prompts with multiple AI models."
            href="/playground"
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
            delay="delay-400"
          />
        </div>
      </section>

      {/* Modules Section */}
      <section
        id="modules"
        style={{
          padding: "80px 24px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.03) 50%, transparent 100%)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Platform Modules
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Explore different areas of the platform
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <ModuleCard
              icon="📚"
              title="Learning Platform"
              description="Articles, tutorials, and prompt pattern library"
              href="/articles"
              status="active"
              itemCount={5}
            />
            <ModuleCard
              icon="🎯"
              title="Prompt Challenges"
              description="Practice writing prompts with real-world scenarios"
              href="/challenges"
              status="active"
              itemCount={5}
            />
            <ModuleCard
              icon="🗺️"
              title="Learning Roadmaps"
              description="Structured paths from beginner to advanced"
              href="/roadmaps"
              status="active"
              itemCount={3}
            />
            <ModuleCard
              icon="🧪"
              title="Prompt Playground"
              description="Test prompts with multiple AI models"
              href="/playground"
              status="coming-soon"
            />
            <ModuleCard
              icon="🏛️"
              title="System Design"
              description="AI architecture and enterprise workflow guides"
              href="/system-design"
              status="active"
              itemCount={2}
            />
          </div>
        </div>
      </section>

      {/* Topics Preview */}
      <section
        id="topics"
        style={{
          padding: "80px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            What You&apos;ll Learn
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Core topics covered in our learning platform
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {topics.map((item) => {
            const Icon = item.Icon;

            return (
              <div
                key={item.topic}
                className="glass-card"
                style={{
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.14), rgba(176,38,255,0.14))",
                    border: "1px solid rgba(0,229,255,0.2)",
                    color: "#7be9ff",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={21} strokeWidth={2.1} />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      marginBottom: "2px",
                    }}
                  >
                    {item.topic}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        style={{
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "56px 40px",
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08), rgba(6,182,212,0.08))",
            border: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Ready to <span className="gradient-text">Level Up</span>?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              marginBottom: "32px",
              maxWidth: "460px",
              margin: "0 auto 32px",
            }}
          >
            Join the community and start mastering prompt engineering today.
            It&apos;s completely free.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/signup"
              id="cta-get-started"
              className="btn-primary"
              style={{ padding: "14px 36px", fontSize: "1rem" }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/articles"
              id="cta-browse"
              className="btn-secondary"
              style={{ padding: "14px 36px", fontSize: "1rem" }}
            >
              Browse Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
