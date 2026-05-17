"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Get the "next" query parameter for post-login redirect
  const nextUrl = searchParams.get("next") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not configured.");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      setMessage("Login successful!");
      router.push(nextUrl);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setMessage("");
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not configured.");
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : `${provider} login failed`);
      setOauthLoading(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        background: "#06070d",
      }}
    >
      {/* ── Left Branding Panel ── */}
      <div
        style={{
          flex: "0 0 42%",
          background: "linear-gradient(145deg, #070a1c 0%, #0d1428 50%, #080d1c 100%)",
          borderRight: "1px solid rgba(0,229,255,0.08)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "52px 56px",
          gap: 0,
        }}
      >
        {/* Background blobs */}
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-40px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(176,38,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4,
          backgroundImage: "linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "inline-flex" }}>
            <Logo size={40} showText={true} textSize="1.35rem" />
          </Link>
        </div>

        {/* Quote + features */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "20px",
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.15)",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#00e5ff",
            marginBottom: "24px",
            width: "fit-content",
          }}>
            AI Learning Platform
          </div>

          <p style={{
            fontSize: "1.5rem",
            fontWeight: 650,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            marginBottom: "40px",
          }}>
            &ldquo;The art of prompt engineering is communicating with precision.&rdquo;
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "50+ curated articles & deep-dives",
              "Interactive prompt challenges",
              "Live AI playground to experiment",
            ].map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#00e5ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer credit */}
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem", position: "relative", zIndex: 1 }}>
          © {new Date().getFullYear()} Prompt Diary. All rights reserved.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
          background: "#06070d",
          position: "relative",
        }}
      >
        {/* Subtle bg glow */}
        <div style={{ position: "absolute", top: "20%", right: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(77,124,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 1 }}>
          {/* Heading */}
          <div style={{ marginBottom: "36px" }}>
            <h1 style={{
              fontSize: "1.85rem",
              fontWeight: 750,
              letterSpacing: "-0.03em",
              color: "#f0f0f5",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}>
              Welcome back
            </h1>
            <p style={{ color: "#9595a8", fontSize: "0.93rem", lineHeight: 1.5 }}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* OAuth Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
            {/* Google */}
            <button
              id="login-google"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "10px",
                border: "1.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#f0f0f5", fontSize: "0.9rem", fontWeight: 500,
                fontFamily: "inherit", cursor: oauthLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 0.2s ease", opacity: oauthLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!oauthLoading) {
                  e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
            </button>

            {/* GitHub */}
            <button
              id="login-github"
              onClick={() => handleOAuth("github")}
              disabled={!!oauthLoading}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "10px",
                border: "1.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#f0f0f5", fontSize: "0.9rem", fontWeight: 500,
                fontFamily: "inherit", cursor: oauthLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 0.2s ease", opacity: oauthLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!oauthLoading) {
                  e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {oauthLoading === "github" ? "Redirecting…" : "Continue with GitHub"}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "0.75rem", color: "#5a5a70", fontWeight: 500, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="login-email" style={{ fontSize: "0.82rem", fontWeight: 550, color: "#9595a8", letterSpacing: "0.01em" }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="login-password" style={{ fontSize: "0.82rem", fontWeight: 550, color: "#9595a8", letterSpacing: "0.01em" }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {message && (
              <div style={{
                padding: "12px 16px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.5,
                background: isError ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                border: isError ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(16,185,129,0.2)",
                color: isError ? "#f87171" : "#34d399",
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px",
                background: "linear-gradient(135deg, #00e5ff, #4d7cff, #b026ff)",
                backgroundSize: "200% 200%",
                color: "white", fontSize: "0.95rem", fontWeight: 600,
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease", opacity: loading ? 0.7 : 1,
                boxShadow: "0 8px 24px rgba(0,140,255,0.25)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,179,255,0.35), 0 0 20px rgba(176,38,255,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,140,255,0.25)";
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", color: "#5a5a70", fontSize: "0.88rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a78bfa")}
            >
              Create one free
            </Link>
          </p>

          <p style={{ textAlign: "center", marginTop: "16px" }}>
            <Link href="/" style={{ color: "#5a5a70", textDecoration: "none", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9595a8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#5a5a70")}
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
