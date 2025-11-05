// src/api/authApi.js

const BASE = import.meta.env.VITE_AUTH_URL || "http://localhost:8081"; // ✅ backend base URL

// ✅ LOGIN API
export async function login(payload) {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Handle backend error messages gracefully
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Invalid credentials");
    }

    // Backend returns JSON { token, message, username }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Login API error:", err.message);
    throw err;
  }
}

// ✅ REGISTER API
export async function register(payload) {
  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Backend sends plain text message ("Registered successfully!" or "User already exists")
    const message = await res.text();

    if (!res.ok) {
      throw new Error(message || "User already exists");
    }

    return message; // ✅ return message to show in frontend
  } catch (err) {
    console.error("❌ Register API error:", err.message);
    throw err;
  }
}
