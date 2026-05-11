/**
 * Profile page demonstrating the UserProfile component
 * This page showcases how to use the UserProfile component to display user data
 */

import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          👤 User Profile
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
          View your profile information and authentication details.
        </p>
      </div>

      <UserProfile />
    </div>
  );
}
