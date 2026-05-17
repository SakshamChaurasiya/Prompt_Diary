"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import {
  BookOpen,
  Target,
  Map,
  Code2,
  Network,
  Search,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    { href: "/articles", label: "Articles", Icon: BookOpen },
    { href: "/challenges", label: "Challenges", Icon: Target },
    { href: "/roadmaps", label: "Roadmaps", Icon: Map },
    { href: "/playground", label: "Playground", Icon: Code2 },
    { href: "/system-design", label: "System Design", Icon: Network },
    { href: "/search", label: "Search", Icon: Search },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    router.push("/");
  };

  // Get user display info
  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "";

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <nav
      id="main-navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(148,163,184,0.14)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Logo size={34} showText={true} textSize="1.25rem" />
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const Icon = link.Icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 14px",
                  borderRadius: "12px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.055)";
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {link.label}
              </Link>
            );
          })}

          <div
            style={{
              width: "1px",
              height: "26px",
              background: "var(--border-subtle)",
              margin: "0 10px",
            }}
          />

          {/* Auth buttons — conditional on login state */}
          {loading ? (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                animation: "pulse-glow 1.5s ease-in-out infinite",
              }}
            />
          ) : user ? (
            /* Logged in — show avatar + dropdown */
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                href="/dashboard"
                id="nav-dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 14px",
                  borderRadius: "12px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.055)";
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <LayoutDashboard size={16} strokeWidth={2} />
                Dashboard
              </Link>

              <button
                id="nav-signout"
                onClick={handleSignOut}
                className="btn-secondary"
                style={{
                  padding: "7px 16px",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>

              {/* Avatar */}
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      border: "2px solid rgba(0,229,255,0.3)",
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(176,38,255,0.2))",
                      border: "2px solid rgba(0,229,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#00e5ff",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)")
                    }
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            /* Not logged in — show login/signup */
            <>
              <Link
                href="/login"
                id="nav-login"
                className="btn-secondary"
                style={{ padding: "8px 20px", fontSize: "0.85rem" }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                id="nav-signup"
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: "0.85rem" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(148,163,184,0.16)",
            borderRadius: "12px",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "9px",
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          style={{
            padding: "16px 24px 24px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            animation: "slideDown 0.3s ease-out",
            background: "rgba(8, 10, 18, 0.96)",
          }}
          className="mobile-menu"
        >
          {navLinks.map((link) => {
            const Icon = link.Icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <Icon size={17} strokeWidth={2} />
                {link.label}
              </Link>
            );
          })}

          {/* Mobile auth buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn-secondary"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
