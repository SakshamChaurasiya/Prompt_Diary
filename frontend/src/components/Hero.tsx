"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { FlaskConical, Volume2, VolumeX } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    // Ensure autoplay works
    video.play().catch(() => {});

    return () => video.removeEventListener("canplay", handleCanPlay);
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        padding: "0 24px",
      }}
    >
      {/* === FULL-SCREEN VIDEO BACKGROUND === */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      >
        <source src="/demo/demo1.mp4" type="video/mp4" />
      </video>

      {/* === CINEMATIC OVERLAYS === */}
      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,7,13,0.75) 0%, rgba(6,7,13,0.5) 35%, rgba(6,7,13,0.45) 55%, rgba(6,7,13,0.85) 100%)",
          zIndex: 1,
        }}
      />

      {/* Side vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(6,7,13,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Color tint overlay — adds the purple/cyan brand feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(77,124,255,0.08) 0%, transparent 40%, rgba(176,38,255,0.06) 70%, rgba(0,229,255,0.05) 100%)",
          zIndex: 1,
        }}
      />

      {/* Scan line effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,229,255,0.012) 3px, transparent 4px)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Decorative grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* HUD corner brackets */}
      {[
        {
          top: "24px",
          left: "24px",
          borderTopWidth: "2px",
          borderTopStyle: "solid" as const,
          borderTopColor: "rgba(0,229,255,0.3)",
          borderLeftWidth: "2px",
          borderLeftStyle: "solid" as const,
          borderLeftColor: "rgba(0,229,255,0.3)",
        },
        {
          top: "24px",
          right: "24px",
          borderTopWidth: "2px",
          borderTopStyle: "solid" as const,
          borderTopColor: "rgba(0,229,255,0.3)",
          borderRightWidth: "2px",
          borderRightStyle: "solid" as const,
          borderRightColor: "rgba(0,229,255,0.3)",
        },
        {
          bottom: "24px",
          left: "24px",
          borderBottomWidth: "2px",
          borderBottomStyle: "solid" as const,
          borderBottomColor: "rgba(0,229,255,0.3)",
          borderLeftWidth: "2px",
          borderLeftStyle: "solid" as const,
          borderLeftColor: "rgba(0,229,255,0.3)",
        },
        {
          bottom: "24px",
          right: "24px",
          borderBottomWidth: "2px",
          borderBottomStyle: "solid" as const,
          borderBottomColor: "rgba(0,229,255,0.3)",
          borderRightWidth: "2px",
          borderRightStyle: "solid" as const,
          borderRightColor: "rgba(0,229,255,0.3)",
        },
      ].map((pos, i) => (
        <div
          key={i}
          style={
            {
              position: "absolute",
              width: "36px",
              height: "36px",
              zIndex: 3,
              pointerEvents: "none",
              ...pos,
            } as React.CSSProperties
          }
        />
      ))}

      {/* === HERO CONTENT (on top of video) === */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "800px",
          padding: "40px 0",
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in-up hud-panel"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "24px",
            color: "#7be9ff",
            fontSize: "0.85rem",
            fontWeight: 500,
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00e5ff, #b026ff)",
              boxShadow: "0 0 10px rgba(0,229,255,0.6)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          Neural Academy Interface
        </div>

        {/* Main heading */}
        <h1
          className="animate-fade-in-up delay-100"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            opacity: 0,
            textShadow: "0 2px 40px rgba(0,0,0,0.5)",
          }}
        >
          Enter the
          <br />
          <span className="gradient-text">AI Battle Arena</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            maxWidth: "640px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
            opacity: 0,
            textShadow: "0 1px 20px rgba(0,0,0,0.4)",
          }}
        >
          Train your prompt skills, unlock challenge levels, and master AI systems
          with a futuristic game-style learning experience.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-fade-in-up delay-300"
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "64px",
            opacity: 0,
          }}
        >
          <Link
            href="/articles"
            id="cta-start-learning"
            className="btn-primary"
            style={{ padding: "14px 32px", fontSize: "1rem" }}
          >
            Start Learning →
          </Link>
          <Link
            href="/playground"
            id="cta-try-playground"
            className="btn-secondary"
            style={{
              padding: "14px 32px",
              fontSize: "1rem",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FlaskConical size={18} strokeWidth={2} />
              Try Playground
            </span>
          </Link>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in-up delay-400"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            flexWrap: "wrap",
            opacity: 0,
          }}
        >
          {[
            { value: "50+", label: "Knowledge Drops" },
            { value: "25+", label: "Mission Challenges" },
            { value: "3", label: "Skill Paths" },
            { value: "24/7", label: "Online Mode" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
                className="gradient-text"
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  textShadow: "0 1px 10px rgba(0,0,0,0.3)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === BOTTOM CONTROLS === */}
      {/* Sound toggle button */}
      <button
        id="hero-mute-toggle"
        onClick={toggleMute}
        style={{
          position: "absolute",
          bottom: "28px",
          right: "28px",
          zIndex: 20,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(6,7,13,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(0,229,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isMuted ? "var(--text-muted)" : "#00e5ff",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)";
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(0,0,0,0.3), 0 0 20px rgba(0,229,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
        }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX size={20} strokeWidth={2} />
        ) : (
          <Volume2 size={20} strokeWidth={2} />
        )}
      </button>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in-up delay-600"
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: "20px",
            height: "32px",
            borderRadius: "12px",
            border: "1.5px solid rgba(0,229,255,0.3)",
            display: "flex",
            justifyContent: "center",
            paddingTop: "6px",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "8px",
              borderRadius: "3px",
              background: "#00e5ff",
              animation: "float 2s ease-in-out infinite",
              boxShadow: "0 0 6px rgba(0,229,255,0.5)",
            }}
          />
        </div>
      </div>

      {/* Bottom fade to rest of page */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background:
            "linear-gradient(to bottom, transparent, var(--bg-primary))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
