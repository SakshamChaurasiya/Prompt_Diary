import Link from "next/link";
import {
  BookOpen,
  Target,
  Map,
  Code2,
  Network,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  gradient: string;
  delay?: string;
}

function FeatureIcon({
  title,
  href,
  color = "white",
}: {
  title: string;
  href: string;
  color?: string;
}) {
  const text = `${title} ${href}`.toLowerCase();

  if (text.includes("article") || text.includes("learn")) {
    return <BookOpen size={25} strokeWidth={2.1} color={color} />;
  }
  if (text.includes("challenge") || text.includes("mission")) {
    return <Target size={25} strokeWidth={2.1} color={color} />;
  }
  if (text.includes("roadmap") || text.includes("path")) {
    return <Map size={25} strokeWidth={2.1} color={color} />;
  }
  if (text.includes("playground") || text.includes("prompt")) {
    return <Code2 size={25} strokeWidth={2.1} color={color} />;
  }
  if (text.includes("system") || text.includes("architecture")) {
    return <Network size={25} strokeWidth={2.1} color={color} />;
  }
  if (text.includes("search")) {
    return <Search size={25} strokeWidth={2.1} color={color} />;
  }

  return <Sparkles size={25} strokeWidth={2.1} color={color} />;
}

export default function FeatureCard({
  icon: _icon,
  title,
  description,
  href,
  gradient,
  delay = "",
}: FeatureCardProps) {
  void _icon;

  return (
    <Link
      href={href}
      className={`glass-card gradient-border animate-fade-in-up ${delay}`}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "32px",
        textDecoration: "none",
        color: "inherit",
        opacity: 0,
        cursor: "pointer",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          boxShadow: `0 8px 24px ${
            gradient.includes("7c3aed")
              ? "rgba(124,58,237,0.2)"
              : gradient.includes("3b82f6")
                ? "rgba(59,130,246,0.2)"
                : gradient.includes("06b6d4")
                  ? "rgba(6,182,212,0.2)"
                  : "rgba(245,158,11,0.2)"
          }`,
        }}
        aria-hidden="true"
      >
        <FeatureIcon title={title} href={href} />
      </div>

      {/* Content */}
      <h3
        style={{
          fontSize: "1.15rem",
          fontWeight: 700,
          marginBottom: "10px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {description}
      </p>

      {/* Arrow */}
      <div
        style={{
          marginTop: "20px",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s ease",
        }}
      >
        Explore
        <ArrowRight size={15} strokeWidth={2} />
      </div>
    </Link>
  );
}
