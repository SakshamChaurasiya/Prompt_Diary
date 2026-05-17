"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  size: 3 + ((i * 7) % 5),
  opacity: 0.3 + ((i * 3) % 4) * 0.08,
  top: `${(i * 23) % 100}%`,
  left: `${(i * 37) % 100}%`,
  duration: 4 + (i % 4),
  delay: (i % 3) * 0.7,
  color: ["#00e5ff", "#4d7cff", "#b026ff"][i % 3],
}));

export default function NotFound() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating particles */}
      {PARTICLES.map((particle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: particle.color,
            opacity: particle.opacity,
            top: particle.top,
            left: particle.left,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Big 404 */}
      <div
        style={{
          fontSize: "clamp(6rem, 18vw, 12rem)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          marginBottom: "16px",
          position: "relative",
          animation: glitch ? "glitch 0.2s ease" : "none",
        }}
        className="gradient-text"
      >
        404
      </div>

      {/* Subtitle */}
      <h1
        style={{
          fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
          fontWeight: 700,
          marginBottom: "12px",
          color: "var(--text-primary)",
        }}
      >
        Lost in the Neural Network
      </h1>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "1rem",
          maxWidth: "420px",
          marginBottom: "40px",
          lineHeight: 1.7,
        }}
      >
        The page you&apos;re looking for has drifted into the void.
        Let&apos;s get you back on track.
      </p>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          className="btn-primary"
          style={{ padding: "14px 32px", fontSize: "1rem" }}
        >
          ← Back to Home
        </Link>
        <Link
          href="/articles"
          className="btn-secondary"
          style={{ padding: "14px 32px", fontSize: "1rem" }}
        >
          Browse Articles
        </Link>
      </div>

      {/* Suggested pages */}
      <div
        style={{
          marginTop: "56px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, label: "Articles", href: "/articles" },
          { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>, label: "Challenges", href: "/challenges" },
          { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-4 4 4 4-8 4 4"/><path d="M21 21H3"/></svg>, label: "Roadmaps", href: "/roadmaps" },
          { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, label: "Playground", href: "/playground" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-card"
            style={{
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "0.88rem",
              fontWeight: 500,
            }}
          >
            <span style={{ display: "flex" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Terminal-style message */}
      <div
        style={{
          marginTop: "48px",
          padding: "16px 24px",
          borderRadius: "12px",
          background: "rgba(0,0,0,0.3)",
          border: "1px solid var(--border-subtle)",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          maxWidth: "440px",
        }}
      >
        <span style={{ color: "#00e5ff" }}>$</span> find / -name &quot;page&quot;
        <br />
        <span style={{ color: "#f87171" }}>Error:</span> page not found in neural_network/
        <br />
        <span style={{ color: "#34d399" }}>Suggestion:</span> try{" "}
        <span style={{ color: "#00e5ff" }}>cd /home</span>
      </div>
    </div>
  );
}
