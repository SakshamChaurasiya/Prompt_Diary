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

interface ModuleCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  status: "active" | "coming-soon";
  itemCount?: number;
}

function ModuleIcon({ title, href }: { title: string; href: string }) {
  const text = `${title} ${href}`.toLowerCase();

  if (text.includes("article") || text.includes("learn")) {
    return <BookOpen size={24} strokeWidth={2.1} />;
  }
  if (text.includes("challenge") || text.includes("mission")) {
    return <Target size={24} strokeWidth={2.1} />;
  }
  if (text.includes("roadmap") || text.includes("path")) {
    return <Map size={24} strokeWidth={2.1} />;
  }
  if (text.includes("playground") || text.includes("prompt")) {
    return <Code2 size={24} strokeWidth={2.1} />;
  }
  if (text.includes("system") || text.includes("architecture")) {
    return <Network size={24} strokeWidth={2.1} />;
  }
  if (text.includes("search")) {
    return <Search size={24} strokeWidth={2.1} />;
  }

  return <Sparkles size={24} strokeWidth={2.1} />;
}

export default function ModuleCard({
  icon: _icon,
  title,
  description,
  href,
  status,
  itemCount,
}: ModuleCardProps) {
  void _icon;

  return (
    <Link
      href={status === "active" ? href : "#"}
      className="glass-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "24px",
        textDecoration: "none",
        color: "inherit",
        opacity: status === "coming-soon" ? 0.5 : 1,
        cursor: status === "active" ? "pointer" : "default",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(0,229,255,0.16), rgba(176,38,255,0.16))",
          border: "1px solid rgba(0,229,255,0.22)",
          color: "#7be9ff",
          boxShadow: "inset 0 0 18px rgba(0,229,255,0.08)",
        }}
        aria-hidden="true"
      >
        <ModuleIcon title={title} href={href} />
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "4px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
            }}
          >
            {title}
          </h3>

          {status === "coming-soon" && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 10px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.1)",
                color: "#fbbf24",
                fontWeight: 700,
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              COMING SOON
            </span>
          )}
        </div>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {itemCount !== undefined && (
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {itemCount} items
        </span>
      )}

      {status === "active" && (
        <ArrowRight
          size={18}
          strokeWidth={2}
          style={{
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
