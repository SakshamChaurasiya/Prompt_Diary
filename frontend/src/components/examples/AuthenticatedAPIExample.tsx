/**
 * Example component demonstrating how to make authenticated API requests
 * using the access token from the Auth Context.
 * 
 * This component shows:
 * 1. How to access the session and access_token from useAuth()
 * 2. How to include the token in API request headers
 * 3. How to handle loading and error states
 * 4. How to handle authentication errors (401)
 */

"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

interface UserData {
  id: string;
  email: string;
  username?: string;
}

export default function AuthenticatedAPIExample() {
  const { session, user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Example: Fetch protected data using the access token
   */
  const fetchProtectedData = async () => {
    // Check if user is authenticated and token is available
    if (!session?.access_token) {
      setError("No access token available. Please log in.");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Include the access token in the Authorization header
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      // Handle authentication errors
      if (response.status === 401) {
        setError("Authentication failed. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setFetching(false);
    }
  };

  /**
   * Example: POST request with access token
   */
  const updateUserProfile = async (username: string) => {
    if (!session?.access_token) {
      setError("No access token available. Please log in.");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (response.status === 401) {
        setError("Authentication failed. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setFetching(false);
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div>
        <p>Please log in to access protected resources.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Authenticated API Example</h2>

      {/* Display current user info */}
      <div style={{ marginBottom: "20px", padding: "10px", background: "#f5f5f5" }}>
        <h3>Current User</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p>
          <strong>Access Token:</strong>{" "}
          {session?.access_token ? 
            `${session.access_token.substring(0, 20)}...` : 
            "Not available"
          }
        </p>
        <p>
          <strong>Token Type:</strong> {session?.token_type || "N/A"}
        </p>
        <p>
          <strong>Expires In:</strong> {session?.expires_in ? `${session.expires_in}s` : "N/A"}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={fetchProtectedData}
          disabled={fetching}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: fetching ? "not-allowed" : "pointer",
          }}
        >
          {fetching ? "Loading..." : "Fetch Protected Data"}
        </button>

        <button
          onClick={() => updateUserProfile("newusername")}
          disabled={fetching}
          style={{
            padding: "10px 20px",
            cursor: fetching ? "not-allowed" : "pointer",
          }}
        >
          {fetching ? "Updating..." : "Update Profile"}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div style={{ padding: "10px", background: "#ffebee", color: "#c62828", marginBottom: "20px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Data display */}
      {userData && (
        <div style={{ padding: "10px", background: "#e8f5e9" }}>
          <h3>Fetched Data</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}

      {/* Code example */}
      <div style={{ marginTop: "30px" }}>
        <h3>Code Example</h3>
        <pre style={{ background: "#f5f5f5", padding: "15px", overflow: "auto" }}>
{`// Access the session from useAuth
const { session } = useAuth();

// Make authenticated API request
const response = await fetch(url, {
  headers: {
    "Authorization": \`Bearer \${session?.access_token}\`,
  },
});`}
        </pre>
      </div>
    </div>
  );
}
