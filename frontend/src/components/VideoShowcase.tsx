"use client";

import { useState, useRef, useEffect } from "react";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(formatTime(video.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      id="video-showcase"
      ref={containerRef}
      style={{
        padding: "20px 24px 100px",
        maxWidth: "1100px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top badge */}
        <div
          className="hud-panel"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "24px",
            color: "#7be9ff",
            fontSize: "0.78rem",
            fontWeight: 600,
            marginBottom: "24px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff4fd8, #b026ff)",
              boxShadow: "0 0 10px #ff4fd8, 0 0 20px rgba(255,79,216,0.3)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          Platform Preview
        </div>

        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          See the{" "}
          <span className="gradient-text">Experience</span> in Action
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Watch how our AI-powered platform transforms the way you learn prompt engineering.
        </p>
      </div>

      {/* Video Container */}
      <div
        style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "visible",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated glow border */}
        <div
          style={{
            position: "absolute",
            inset: "-3px",
            borderRadius: "23px",
            background: "linear-gradient(135deg, #00e5ff, #b026ff, #ff4fd8, #00e5ff)",
            backgroundSize: "300% 300%",
            animation: "gradientShift 6s ease infinite",
            opacity: isHovered ? 0.7 : 0.25,
            transition: "opacity 0.6s ease",
            zIndex: 0,
            filter: "blur(1px)",
          }}
        />

        {/* Outer ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            borderRadius: "40px",
            background: "radial-gradient(ellipse at center, rgba(0,229,255,0.08), transparent 70%)",
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.6s ease",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />

        {/* Main video wrapper */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(6,7,13,0.97), rgba(13,17,32,0.97))",
            border: "1px solid rgba(0,229,255,0.15)",
            boxShadow: isHovered
              ? "0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,229,255,0.1), 0 0 100px rgba(176,38,255,0.05)"
              : "0 20px 60px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.6s ease",
          }}
        >
          {/* Top bar — macOS style browser chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#ff5f57",
                  boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.2)",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#ffbd2e",
                  boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.2)",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#28ca42",
                  boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.2)",
                }}
              />
            </div>

            {/* URL bar */}
            <div
              style={{
                flex: 1,
                maxWidth: "380px",
                margin: "0 20px",
                padding: "7px 16px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-geist-mono), monospace",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#28ca42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>prompt-diary.ai</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
              <span style={{ color: "rgba(0,229,255,0.6)" }}>demo</span>
            </div>

            {/* Live indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "0.7rem",
                color: "#00e5ff",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#00e5ff",
                  boxShadow: "0 0 10px rgba(0,229,255,0.8), 0 0 20px rgba(0,229,255,0.4)",
                  animation: "pulse-glow 1.5s ease-in-out infinite",
                }}
              />
              LIVE
            </div>
          </div>

          {/* Video area */}
          <div
            style={{
              position: "relative",
              aspectRatio: "16/9",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={togglePlay}
          >
            {/* The actual video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <source src="/demo/demo1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Top vignette */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(6,7,13,0.3) 0%, transparent 20%, transparent 80%, rgba(6,7,13,0.5) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Subtle scan line effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,229,255,0.015) 3px, transparent 4px)",
                pointerEvents: "none",
                opacity: isHovered ? 0.8 : 0.4,
                transition: "opacity 0.4s ease",
              }}
            />

            {/* HUD corner brackets */}
            {[
              { top: "20px", left: "20px", borderTop: "2px solid", borderLeft: "2px solid" },
              { top: "20px", right: "20px", borderTop: "2px solid", borderRight: "2px solid" },
              { bottom: "20px", left: "20px", borderBottom: "2px solid", borderLeft: "2px solid" },
              { bottom: "20px", right: "20px", borderBottom: "2px solid", borderRight: "2px solid" },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "28px",
                  height: "28px",
                  pointerEvents: "none",
                  borderColor: `rgba(0,229,255,${isHovered ? 0.6 : 0.25})`,
                  transition: "border-color 0.4s ease",
                  ...pos,
                } as React.CSSProperties}
              />
            ))}

            {/* Floating feature tags on hover */}
            <div
              style={{
                position: "absolute",
                top: "28px",
                left: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, text: "Real-time AI Feedback", delay: 0 },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, text: "Neural Processing", delay: 0.08 },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-4 4 4 4-8 4 4"/><path d="M21 21H3"/></svg>, text: "Adaptive Learning", delay: 0.16 },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "10px",
                    background: "rgba(6,7,13,0.75)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: "#7be9ff",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateX(0)" : "translateX(-16px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay}s`,
                    pointerEvents: "none",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Bottom right tech badges on hover */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
                right: "28px",
                display: "flex",
                gap: "8px",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                pointerEvents: "none",
              }}
            >
              {["GPT-4", "Claude", "Gemini"].map((model, i) => (
                <div
                  key={i}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    background: "rgba(6,7,13,0.75)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(176,38,255,0.25)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#c084fc",
                    letterSpacing: "0.03em",
                  }}
                >
                  {model}
                </div>
              ))}
            </div>

            {/* Center play/pause overlay */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: isHovered && isPlaying ? 0.9 : !isPlaying ? 1 : 0,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(6,7,13,0.6)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "2px solid rgba(0,229,255,0.35)",
                  boxShadow: "0 0 40px rgba(0,229,255,0.15), inset 0 0 20px rgba(0,229,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "#00e5ff",
                }}
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#00e5ff" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#00e5ff" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </div>
            </div>
          </div>

          {/* Bottom control bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 20px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(0,0,0,0.45)",
            }}
          >
            {/* Play/Pause */}
            <button
              id="video-play-btn"
              onClick={togglePlay}
              style={{
                background: "none",
                border: "none",
                color: "#00e5ff",
                fontSize: "16px",
                cursor: "pointer",
                padding: "4px 6px",
                display: "flex",
                alignItems: "center",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,229,255,0.1)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>

            {/* Current time */}
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-geist-mono), monospace",
                fontVariantNumeric: "tabular-nums",
                minWidth: "36px",
              }}
            >
              {currentTime}
            </span>

            {/* Progress bar */}
            <div
              style={{
                flex: 1,
                height: "4px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "4px",
                overflow: "visible",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={(e) => {
                e.stopPropagation();
                const video = videoRef.current;
                if (!video) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;
                video.currentTime = percent * video.duration;
              }}
            >
              {/* Buffered / loaded track */}
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  width: `${Math.min(progress + 15, 100)}%`,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                }}
              />
              {/* Active progress */}
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #00e5ff, #b026ff)",
                  borderRadius: "4px",
                  transition: "width 0.1s linear",
                  boxShadow: "0 0 8px rgba(0,229,255,0.4)",
                }}
              />
              {/* Seek dot */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${progress}%`,
                  transform: "translate(-50%, -50%)",
                  width: isHovered ? "12px" : "8px",
                  height: isHovered ? "12px" : "8px",
                  borderRadius: "50%",
                  background: "#00e5ff",
                  boxShadow: "0 0 8px rgba(0,229,255,0.8), 0 0 16px rgba(0,229,255,0.3)",
                  transition: "all 0.3s ease",
                }}
              />
            </div>

            {/* Duration */}
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-geist-mono), monospace",
                fontVariantNumeric: "tabular-nums",
                minWidth: "36px",
              }}
            >
              {duration}
            </span>

            {/* Mute toggle */}
            <button
              id="video-mute-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              style={{
                background: "none",
                border: "none",
                color: isMuted ? "var(--text-muted)" : "#00e5ff",
                fontSize: "16px",
                cursor: "pointer",
                padding: "4px 6px",
                display: "flex",
                alignItems: "center",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,229,255,0.1)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isMuted ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              )}
            </button>

            {/* Quality badge */}
            <div
              style={{
                padding: "3px 10px",
                borderRadius: "5px",
                background: "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(176,38,255,0.12))",
                border: "1px solid rgba(0,229,255,0.2)",
                fontSize: "0.62rem",
                fontWeight: 700,
                color: "#00e5ff",
                letterSpacing: "0.08em",
              }}
            >
              1080p
            </div>
          </div>
        </div>

        {/* Bottom reflection glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "15%",
            right: "15%",
            height: "100px",
            background: "radial-gradient(ellipse at center, rgba(0,229,255,0.12) 0%, rgba(176,38,255,0.06) 40%, transparent 70%)",
            filter: "blur(25px)",
            pointerEvents: "none",
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.6s ease",
          }}
        />
      </div>

      {/* Feature highlights below video */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "56px",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
        }}
      >
        {[
          {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
            title: "Interactive Demos",
            desc: "Watch real-time AI interactions",
            color: "#00e5ff",
            glow: "rgba(0,229,255,0.15)",
          },
          {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
            title: "Live Playground",
            desc: "Test prompts as you learn",
            color: "#b026ff",
            glow: "rgba(176,38,255,0.15)",
          },
          {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
            title: "Visual Analytics",
            desc: "Track your learning progress",
            color: "#ff4fd8",
            glow: "rgba(255,79,216,0.15)",
          },
          {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
            title: "Challenge Mode",
            desc: "Compete in timed prompt battles",
            color: "#f59e0b",
            glow: "rgba(245,158,11,0.15)",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              padding: "22px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.1}s`,
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: item.glow,
                border: `1px solid ${item.color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: item.color,
                boxShadow: `0 0 20px ${item.glow}`,
              }}
            >
              <span style={{ display: "flex" }}>{item.icon}</span>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "4px",
                  color: "var(--text-primary)",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
