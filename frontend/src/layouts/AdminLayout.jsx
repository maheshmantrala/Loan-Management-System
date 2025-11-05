import React from "react";
import { useNavigate, Outlet, Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

export default function AdminLayout() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block py-2.5 px-4 rounded-lg transition text-sm font-medium ${
      isActive
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  const adminName =
    localStorage.getItem("username") || localStorage.getItem("adminName") || "Admin";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/customers" className={linkClass}>
            Customers
          </NavLink>
          <NavLink to="/admin/applications" className={linkClass}>
            Applications
          </NavLink>
          <NavLink to="/admin/accounts" className={linkClass}>
            Accounts
          </NavLink>
          <NavLink to="/admin/documents" className={linkClass}>
            Documents
          </NavLink>
          <NavLink to="/admin/notifications" className={linkClass}>
            Notifications
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* 🔝 Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <div className="text-xl font-semibold text-gray-800">
            🏦 Loan Management System
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <NotificationBell role="ADMIN" />

            {/* Admin Info */}
            <div className="flex items-center gap-3">
              <div className="text-gray-700 text-sm">
                <span className="font-medium">{adminName}</span>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
