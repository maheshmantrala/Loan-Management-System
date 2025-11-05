import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { listNotifications, markNotificationRead } from "../api/notificationApi";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔹 Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const data = await listNotifications();
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } else {
        console.warn("⚠️ Unexpected response from API:", data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center p-2 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-600 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b font-semibold bg-gray-50 flex justify-between">
            <span>Notifications</span>
            <button
              onClick={() => setNotifications([])}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleMarkRead(n.id)}
                >
                  <p className="text-sm font-medium text-gray-800">
                    {n.subject || n.title || "Notification"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {n.message || n.body || "No details available"}
                  </p>
                  {n.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
