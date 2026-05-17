"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { getUserStats } from "@/lib/api";
import Skeleton from "@/components/Skeleton";

const ModuleIcon = ({ path, viewBox = "0 0 24 24" }: { path: React.ReactNode; viewBox?: string }) => (
  <svg width="22" height="22" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);

const modules = [
  { title: "Learning Articles",  href: "/articles",      icon: <ModuleIcon path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>} />, desc: "Read in-depth guides" },
  { title: "Prompt Challenges",  href: "/challenges",    icon: <ModuleIcon path={<><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>} />, desc: "Practice prompts" },
  { title: "Prompt Playground",  href: "/playground",    icon: <ModuleIcon path={<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>} />, desc: "Test your prompts" },
  { title: "Learning Roadmaps",  href: "/roadmaps",      icon: <ModuleIcon path={<><path d="M3 17l4-4 4 4 4-8 4 4"/><path d="M21 21H3"/></>} />, desc: "Structured paths" },
  { title: "System Design",      href: "/system-design", icon: <ModuleIcon path={<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>} />, desc: "AI architectures" },
];

interface UserStatsData {
  articles_completed: number;
  challenges_completed: number;
  total_points: number;
  level: string;
}

/* Progress Ring SVG component */
function ProgressRing({ progress, size = 72, color = "#00e5ff", label = "" }: {
  progress: number; size?: number; color?: string; label?: string;
}) {
  const stroke = 5;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          className="progress-ring-circle"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color }}>{progress}%</span>
        {label && <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{label}</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStatsLoading(false);
      return;
    }

    async function loadStats() {
      try {
        const data = await getUserStats();
        if (data?.success && data.stats) {
          setStats(data.stats);
        }
      } catch {
        // Stats fetch failed — show defaults
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Skeleton loading state
  if (loading) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
          <Skeleton variant="avatar" />
          <div style={{ flex: 1 }}>
            <Skeleton variant="title" width="200px" />
            <Skeleton variant="text" width="160px" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "36px" }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" height="140px" />)}
        </div>
        <Skeleton variant="title" width="300px" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "16px" }}>
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} variant="card" height="120px" />)}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    user.user_metadata?.display_name ||
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Learner";

  const avatarUrl = user.user_metadata?.avatar_url;
  const handleSignOut = async () => { await signOut(); router.push("/"); };

  const levelColors: Record<string, string> = {
    Newcomer: "#6b7280", Beginner: "#10b981", Intermediate: "#3b82f6",
    Advanced: "#a855f6", Expert: "#f59e0b",
  };
  const currentLevel = stats?.level || "Newcomer";
  const levelColor = levelColors[currentLevel] || "#6b7280";

  // Gamification data
  const streak = 5; // Would come from API
  const xp = stats?.total_points ?? 0;
  const nextLevelXp = currentLevel === "Newcomer" ? 100 : currentLevel === "Beginner" ? 300 : currentLevel === "Intermediate" ? 700 : 1500;
  const xpProgress = Math.min(Math.round((xp / nextLevelXp) * 100), 100);

  const recentActivity = [
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, text: "Read \"Prompt Engineering Fundamentals\"", time: "2h ago", color: "#7c3aed" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>, text: "Completed Summarization Challenge", time: "5h ago", color: "#3b82f6" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, text: "Earned 50 XP", time: "5h ago", color: "#f59e0b" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-4 4 4 4-8 4 4"/><path d="M21 21H3"/></svg>, text: "Started Beginner Roadmap", time: "1d ago", color: "#06b6d4" },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Welcome header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: "56px", height: "56px", borderRadius: "50%", border: `3px solid ${levelColor}`, objectFit: "cover" }} />
          ) : (
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg, ${levelColor}33, rgba(176,38,255,0.2))`, border: `3px solid ${levelColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: levelColor }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, marginBottom: "4px" }}>
              Welcome, <span className="gradient-text">{displayName}</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{user.email}</p>
              <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: `${levelColor}20`, color: levelColor, border: `1px solid ${levelColor}40` }}>
                {currentLevel}
              </span>
            </div>
          </div>
        </div>
        <button id="dashboard-logout" onClick={handleSignOut} className="btn-secondary" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Sign Out</button>
      </div>

      {/* Streak + XP Progress Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
        {/* Streak Card */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"/><path d="M12 12c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b" }}>{streak}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>Day Streak</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{
                width: "8px", height: i < streak ? "24px" : "12px", borderRadius: "4px",
                background: i < streak ? "linear-gradient(to top, #f59e0b, #ef4444)" : "rgba(255,255,255,0.06)",
                transition: "height 0.3s ease", alignSelf: "flex-end",
              }} />
            ))}
          </div>
        </div>

        {/* XP Progress Card */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <ProgressRing progress={xpProgress} color={levelColor} label="to next" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>XP Progress</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{xp} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}>/ {nextLevelXp} XP</span></div>
            <div style={{ marginTop: "8px", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xpProgress}%`, background: `linear-gradient(90deg, ${levelColor}, ${levelColor}99)`, borderRadius: "3px", transition: "width 1s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Banner */}
      <div className="glass-card hud-panel" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Continue: Prompt Engineering Fundamentals</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>You&apos;re 40% through this article</div>
          </div>
        </div>
        <Link href="/articles" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Continue →</Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "36px" }}>
        {([
          { label: "Articles Read",    value: statsLoading ? "—" : (stats?.articles_completed ?? 0),  gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
          { label: "Challenges Solved", value: statsLoading ? "—" : (stats?.challenges_completed ?? 0), gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> },
          { label: "Total Points",     value: statsLoading ? "—" : (stats?.total_points ?? 0),         gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
          { label: "Level",            value: statsLoading ? "—" : currentLevel,                        gradient: `linear-gradient(135deg, ${levelColor}, ${levelColor}99)`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> },
        ] as const).map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: "20px", textAlign: "center", borderTop: `2px solid ${stat.gradient.match(/#[0-9a-fA-F]{6}/)?.[0] || "transparent"}` }}>
            <div style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: stat.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "4px" }} className="gradient-text">{stat.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>Recent Activity</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {recentActivity.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${item.color}15`, border: `1px solid ${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>
                {item.icon}
              </div>
              <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 500 }}>{item.text}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "24px" }}>
        Choose a module to continue your learning journey.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
        {modules.map((module) => (
          <Link key={module.title} href={module.href} className="glass-card" style={{ textDecoration: "none", color: "inherit", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ display: "flex", color: "var(--text-secondary)" }}>{module.icon}</span>
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{module.title}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{module.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
