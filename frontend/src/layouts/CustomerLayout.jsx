import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

export default function CustomerLayout() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const username =
    localStorage.getItem("customerName") ||
    localStorage.getItem("username") ||
    "Customer";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block py-2.5 px-4 rounded-lg transition text-sm font-medium ${
      isActive
        ? "bg-blue-700 text-white"
        : "text-blue-100 hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-5 border-b border-blue-800">
          <h2 className="text-2xl font-bold tracking-wide">Loan Portal</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink to="/customer/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/customer/loans" className={linkClass}>
            My Loans
          </NavLink>
          <NavLink to="/customer/apply-loan" className={linkClass}>
            Apply for Loan
          </NavLink>
          <NavLink to="/customer/upload-documents" className={linkClass}>
            Upload Documents
          </NavLink>
          <NavLink to="/customer/payments" className={linkClass}>
            My Payments
          </NavLink>
          <NavLink to="/customer/profile" className={linkClass}>
            My Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* 🔝 Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <div className="text-xl font-semibold text-blue-800">
            🏦 Customer Dashboard
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <NotificationBell role="CUSTOMER" />

            {/* Customer Info */}
            <div className="flex items-center gap-3">
              <div className="text-gray-700 text-sm">
                <span className="font-medium">{username}</span>
                <p className="text-xs text-gray-500">Valued Customer</p>
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
