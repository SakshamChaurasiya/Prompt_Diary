"use client";

interface SkeletonProps {
  variant?: "text" | "title" | "card" | "icon" | "avatar" | "block";
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export default function Skeleton({
  variant = "text",
  width,
  height,
  count = 1,
  className = "",
}: SkeletonProps) {
  const items = Array.from({ length: count });
  const textWidths = ["72%", "84%", "65%", "90%", "78%"];

  if (variant === "card") {
    return (
      <div className={`skeleton-card ${className}`} style={{ width, minHeight: height || "180px" }}>
        <div className="skeleton skeleton-icon" style={{ marginBottom: "20px" }} />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" style={{ width: "90%" }} />
        <div className="skeleton skeleton-text" style={{ width: "70%" }} />
      </div>
    );
  }

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`skeleton ${variant === "title" ? "skeleton-title" : variant === "icon" ? "skeleton-icon" : variant === "avatar" ? "skeleton-avatar" : variant === "block" ? "" : "skeleton-text"} ${className}`}
          style={{
            width: width || (variant === "text" ? textWidths[i % textWidths.length] : undefined),
            height: height || undefined,
          }}
        />
      ))}
    </>
  );
}

/* Pre-built skeleton layouts */
export function FeatureCardSkeleton() {
  return (
    <div className="skeleton-card" style={{ padding: "32px", borderRadius: "16px" }}>
      <div className="skeleton skeleton-icon" style={{ marginBottom: "20px" }} />
      <div className="skeleton skeleton-title" style={{ width: "60%" }} />
      <div className="skeleton skeleton-text" style={{ width: "90%" }} />
      <div className="skeleton skeleton-text" style={{ width: "75%" }} />
      <div className="skeleton skeleton-text" style={{ width: "40%", marginTop: "20px" }} />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="skeleton-card" style={{ padding: "24px", borderRadius: "16px" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div className="skeleton" style={{ width: "60px", height: "20px", borderRadius: "20px" }} />
        <div className="skeleton" style={{ width: "80px", height: "20px", borderRadius: "20px" }} />
      </div>
      <div className="skeleton skeleton-title" style={{ width: "80%" }} />
      <div className="skeleton skeleton-text" style={{ width: "95%" }} />
      <div className="skeleton skeleton-text" style={{ width: "65%" }} />
    </div>
  );
}
