import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CustomersPage from "./pages/dashboard/CustomersPage";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage";
import AccountsPage from "./pages/dashboard/AccountsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import MyLoansPage from "./pages/dashboard/MyLoansPage";
import MyPaymentsPage from "./pages/dashboard/MyPaymentsPage";
import MyProfilePage from "./pages/dashboard/MyProfilePage";
import SupportPage from "./pages/dashboard/SupportPage";
import CustomerDashboard from "./pages/dashboard/customerdashboard";
import ApplyLoan from "./pages/dashboard/ApplyLoan";  
import UploadDocuments from "./pages/dashboard/UploadDocuments";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ===================== ADMIN ROUTES ===================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested admin pages */}
            <Route index element={<AdminDashboard />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* ===================== CUSTOMER ROUTES ===================== */}
    <Route
  path="/customer"
  element={
    <ProtectedRoute role="CUSTOMER">
      <CustomerLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<CustomerDashboard />} />
  <Route path="dashboard" element={<CustomerDashboard />} />
  <Route path="loans" element={<MyLoansPage />} />
  <Route path="apply-loan" element={<ApplyLoan />} />
  <Route path="upload-documents" element={<UploadDocuments />} />
  <Route path="payments" element={<MyPaymentsPage />} />
  <Route path="profile" element={<MyProfilePage />} />
  <Route path="support" element={<SupportPage />} />
</Route>


          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={<div className="p-10 text-red-500">Unauthorized</div>}
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
