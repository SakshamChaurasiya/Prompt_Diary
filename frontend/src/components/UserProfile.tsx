/**
 * Example component demonstrating how to use user profile data from Auth Context.
 * 
 * This component shows:
 * 1. How to access user data from useAuth() hook
 * 2. How to display user email, username, and avatar
 * 3. How to show authentication provider information
 * 4. How to handle loading and unauthenticated states
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.7**
 */

"use client";

import { useAuth } from "@/lib/AuthContext";

export default function UserProfile() {
  const { user, session, loading } = useAuth();

  // Handle loading state while auth is initializing
  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "40px",
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
            Loading user profile...
          </span>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: "20px",
            background: "rgba(255, 235, 238, 0.1)",
            border: "1px solid rgba(198, 40, 40, 0.3)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: "16px", color: "var(--text-secondary)" }}>
            Please log in to view your profile.
          </p>
          <a
            href="/login"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "linear-gradient(135deg, #00e5ff, #b026ff)",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Extract user profile data
  const email = user.email || "No email available";
  const userId = user.id;
  const username = user.user_metadata?.username || user.user_metadata?.display_name || "Not set";
  const avatarUrl = user.user_metadata?.avatar_url;
  
  // Determine authentication provider
  const provider = user.app_metadata?.provider || "email";
  const providers = user.app_metadata?.providers || [provider];
  
  // Format provider name for display
  const formatProvider = (providerName: string): string => {
    const providerMap: Record<string, string> = {
      email: "Email/Password",
      google: "Google",
      github: "GitHub",
    };
    return providerMap[providerName] || providerName;
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        User Profile
      </h2>

      {/* Profile Card */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        {/* Avatar and Basic Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid rgba(0,229,255,0.3)",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(176,38,255,0.2))",
                border: "3px solid rgba(0,229,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 700,
                color: "#00e5ff",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name and Email */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              {username}
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              {email}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* User ID */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              User ID
            </label>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {userId}
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              {email}
            </p>
          </div>

          {/* Username */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              {username}
            </p>
          </div>

          {/* Authentication Provider */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Authentication Provider
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {providers.map((p: string) => (
                <span
                  key={p}
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: "rgba(0, 229, 255, 0.1)",
                    border: "1px solid rgba(0, 229, 255, 0.3)",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    color: "#00e5ff",
                    fontWeight: 600,
                  }}
                >
                  {formatProvider(p)}
                </span>
              ))}
            </div>
          </div>

          {/* Avatar URL (if available) */}
          {avatarUrl && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Avatar URL
              </label>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {avatarUrl}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Session Info Card */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Session Information
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Access Token Preview */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Access Token
            </label>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {session?.access_token
                ? `${session.access_token.substring(0, 40)}...`
                : "Not available"}
            </p>
          </div>

          {/* Token Type */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Token Type
            </label>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              {session?.token_type || "N/A"}
            </p>
          </div>

          {/* Expires In */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Token Expires In
            </label>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              {session?.expires_in ? `${session.expires_in} seconds` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Example */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "rgba(0, 229, 255, 0.05)",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          borderRadius: "8px",
        }}
      >
        <h4
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            marginBottom: "12px",
            color: "#00e5ff",
          }}
        >
          💡 Usage Example
        </h4>
        <pre
          style={{
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            overflow: "auto",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
{`import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { user, session, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Username: {user.user_metadata?.username}</p>
      <p>Provider: {user.app_metadata?.provider}</p>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}
