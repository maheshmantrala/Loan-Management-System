import { fetchWithAuth } from "./fetchWithAuth";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import (no default export)

const BASE = import.meta.env.VITE_NOTIFICATION;

/* -------------------------------------------------------------------------- */
/* 🟢 NOTIFICATION API METHODS */
/* -------------------------------------------------------------------------- */

// 🔹 Decode JWT to extract username and role
function getUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  try {
    const decoded = jwtDecode(token);
    // adjust these keys based on your JWT payload structure
    return {
      username: decoded.sub || decoded.username || decoded.user_name,
      role:
        decoded.role ||
        decoded.roles?.[0] ||
        decoded.authorities?.[0] ||
        decoded.scope,
    };
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return {};
  }
}

// 🔹 Fetch notifications (customer or admin)
export const listNotifications = async () => {
  const { role, username } = getUserInfo();
  if (!role) throw new Error("Missing user role or token");

  if (role === "ADMIN" || role === "ROLE_ADMIN") {
    // Admin sees all notifications
    return fetchWithAuth(`${BASE}/notifications`);
  } else {
    // Customer sees only their notifications
    return fetchWithAuth(`${BASE}/notifications/customer/${username}`);
  }
};

// 🔹 Mark notification as read
export const markNotificationRead = (id) =>
  fetchWithAuth(`${BASE}/notifications/${id}/read`, {
    method: "PATCH",
  });

// 🔹 Send Email to a specific customer
export const sendEmailToCustomer = (username, subject, body) =>
  fetchWithAuth(
    `${BASE}/notifications/email/to-customer?username=${encodeURIComponent(
      username
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    { method: "POST" }
  );

// 🔹 Send SMS to a specific customer
export const sendSmsToCustomer = (phone, message) =>
  fetchWithAuth(
    `${BASE}/notifications/sms/to-customer?phone=${encodeURIComponent(
      phone
    )}&message=${encodeURIComponent(message)}`,
    { method: "POST" }
  );

// ✅ (Optional) Backward compatibility with older components
export const sendEmail = sendEmailToCustomer;
export const sendSms = sendSmsToCustomer;
