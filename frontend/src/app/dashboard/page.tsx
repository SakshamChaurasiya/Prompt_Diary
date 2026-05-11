"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const modules = [
  { title: "Learning Articles", href: "/articles", icon: "📚" },
  { title: "Prompt Challenges", href: "/challenges", icon: "🎯" },
  { title: "Prompt Playground", href: "/playground", icon: "🧪" },
  { title: "Learning Roadmaps", href: "/roadmaps", icon: "🗺️" },
  { title: "System Design", href: "/system-design", icon: "🏛️" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "48px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid rgba(0,229,255,0.2)",
              borderTopColor: "#00e5ff",
              animation: "orbit 0.8s linear infinite",
            }}
          />
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Preserve current URL as "next" query parameter
    const currentPath = "/dashboard";
    router.replace(`/login?next=${encodeURIComponent(currentPath)}`);
    return null;
  }

  // Get display name from user metadata or email
  const displayName =
    user.user_metadata?.display_name ||
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Learner";

  const avatarUrl = user.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Welcome header with user info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "36px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "2px solid rgba(0,229,255,0.3)",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(176,38,255,0.2))",
                border: "2px solid rgba(0,229,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#00e5ff",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              Welcome, <span className="gradient-text">{displayName}</span>
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        <button
          id="dashboard-logout"
          onClick={handleSignOut}
          className="btn-secondary"
          style={{
            padding: "8px 20px",
            fontSize: "0.85rem",
          }}
        >
          Sign Out
        </button>
      </div>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.05rem",
          marginBottom: "36px",
        }}
      >
        Choose a module to continue your learning journey.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="glass-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{module.icon}</span>
            <span style={{ fontWeight: 600 }}>{module.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
