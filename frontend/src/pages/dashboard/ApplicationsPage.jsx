import React, { useEffect, useState } from "react";
import {
  listApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../../api/originationApi";

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 Load applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await listApplications();
      setApps(data || []);
    } catch (err) {
      console.error("❌ Failed to load applications:", err);
      setError("Unable to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // 🟢 Approve / Reject
  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApps((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: status.toUpperCase() } : a
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Error updating status");
    }
  };

  // 🔴 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await deleteApplication(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      alert("Error deleting application");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-gray-500 text-center">
        Loading applications...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-500 text-center">
        {error}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Applications</h1>

      {apps.length === 0 ? (
        <p className="text-gray-500 text-center">No applications found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left w-16">ID</th>
              <th className="py-2 px-4 text-left w-48">Customer</th>
              <th className="py-2 px-4 text-left w-36">Loan Type</th>
              <th className="py-2 px-4 text-left w-32">Amount</th>
              <th className="py-2 px-4 text-left w-40">Interest Rate (%)</th>
              <th className="py-2 px-4 text-left w-40">Term (months)</th>
              <th className="py-2 px-4 text-left w-32">Status</th>
              <th className="py-2 px-4 text-left w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                {/* ✅ ID FIRST */}
                <td className="py-2 px-4">{a.id}</td>

                {/* ✅ Customer Name or ID */}
                <td className="py-2 px-4">
                  {a.customerName ? a.customerName : ` ${a.customerId}`}
                </td>

                {/* ✅ Loan Details */}
                <td className="py-2 px-4">{a.loanType}</td>
                <td className="py-2 px-4">
                  {a.amount?.toLocaleString("en-IN")}
                </td>
                <td className="py-2 px-4">{a.interestRate}</td>
                <td className="py-2 px-4">{a.termMonths}</td>

                {/* ✅ Status */}
                <td
                  className={`py-2 px-4 font-semibold ${
                    a.status === "APPROVED"
                      ? "text-green-600"
                      : a.status === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {a.status}
                </td>

                {/* ✅ Actions */}
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(a.id, "APPROVED")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={a.status === "APPROVED"}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusChange(a.id, "REJECTED")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={a.status === "REJECTED"}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
