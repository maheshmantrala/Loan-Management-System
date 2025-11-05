import React, { useEffect, useState } from "react";
import {
  listAccounts,
  getSchedule,
  listPayments,
  updateAccountStatus,
  deleteAccount,
} from "../../api/servicingApi";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [payments, setPayments] = useState([]);
  const [viewType, setViewType] = useState("list");

  // 🔹 Load accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await listAccounts();
        setAccounts(data || []);
      } catch (err) {
        console.error("Failed to load accounts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  // 🔹 View schedule for an account
  const handleViewSchedule = async (id) => {
    try {
      const data = await getSchedule(id);
      setSelectedAccount(id);
      setSchedule(data || []);
      setViewType("schedule");
    } catch (err) {
      alert("Failed to load schedule.");
    }
  };

  // 🔹 View payments for an account
  const handleViewPayments = async (id) => {
    try {
      const data = await listPayments(id);
      setSelectedAccount(id);
      setPayments(data || []);
      setViewType("payments");
    } catch (err) {
      alert("Failed to load payments.");
    }
  };

  // 🔹 Mark account as CLOSED
  const handleCloseAccount = async (id) => {
    if (!confirm("Mark this account as CLOSED?")) return;
    await updateAccountStatus(id, "CLOSED");
    alert("Account closed successfully!");
    const refreshed = await listAccounts();
    setAccounts(refreshed);
  };

  // 🔹 Delete account
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this account?")) return;
    await deleteAccount(id);
    alert("Deleted successfully!");
    const refreshed = await listAccounts();
    setAccounts(refreshed);
  };

  if (loading)
    return (
      <div className="p-6 text-gray-500 text-center">Loading accounts...</div>
    );

  // 🔹 Detail view (schedule or payments)
  if (viewType !== "list") {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => setViewType("list")}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back to Accounts
        </button>

        {viewType === "schedule" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Repayment Schedule for Account #{selectedAccount}
            </h2>
            <table className="w-full border border-gray-300 bg-white rounded-lg shadow text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Principal</th>
                  <th className="p-2">Interest</th>
                  <th className="p-2">Total EMI</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {schedule.length > 0 ? (
                  schedule.map((i) => (
                    <tr key={i.installmentNo} className="border-b">
                      <td className="p-2 text-center">{i.installmentNo}</td>
                      <td className="p-2 text-center">{i.dueDate}</td>
                      <td className="p-2 text-right">
                        ₹{i.principalComponent?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right">
                        ₹{i.interestComponent?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right font-medium">
                        ₹{i.installmentAmount?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right">
                        ₹{i.paidAmount?.toLocaleString("en-IN")}
                      </td>
                      <td
                        className={`p-2 text-center font-semibold ${
                          i.status === "PAID"
                            ? "text-green-600"
                            : i.status === "DUE"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {i.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No schedule found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

       {viewType === "payments" && (
  <>
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
      Payments for Account #{selectedAccount}
    </h2>

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left w-20">ID</th>
            <th className="p-3 text-right w-40">Amount</th>
            <th className="p-3 text-center w-40">Date</th>
            <th className="p-3 text-center w-40">Mode</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            <>
              {payments.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-left">{p.id}</td>
                  <td className="p-3 text-right font-medium text-gray-800">
                    ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center text-gray-700">
                    {p.paymentDate}
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-600">
                    {p.mode}
                  </td>
                </tr>
              ))}

              {/* 🔹 Total Row */}
              <tr className="bg-gray-50 font-semibold text-gray-900 border-t">
                <td className="p-3 text-left" colSpan="1">
                  Total
                </td>
                <td className="p-3 text-right text-green-700">
                  ₹
                  {payments
                    .reduce(
                      (sum, p) => sum + (Number(p.amount) || 0),
                      0
                    )
                    .toLocaleString("en-IN")}
                </td>
                <td colSpan="2"></td>
              </tr>
            </>
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center py-4 text-gray-500 italic"
              >
                No payments recorded yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </>
)}

      </div>
    );
  }

  // 🔹 Main account list view
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Loan Accounts</h1>

      <table className="w-full border border-gray-300 rounded-lg shadow bg-white text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Customer ID</th>
            <th className="py-3 px-6 text-left">Loan Type</th>
            <th className="py-3 px-6 text-right">Principal</th>
            <th className="py-3 px-6 text-center">Interest Rate (%)</th>
            <th className="py-3 px-6 text-center">Term (Months)</th>
            <th className="py-3 px-6 text-center">Start Date</th>
            <th className="py-3 px-6 text-center">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} className="border-t hover:bg-gray-50">
              <td className="py-3 px-6">{a.id}</td>
              <td className="py-3 px-6">{a.customerId}</td>
              <td className="py-3 px-6">{a.loanType}</td>
              <td className="py-3 px-6 text-right">
                ₹{a.principal?.toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-6 text-center">{a.annualInterestRate}</td>
              <td className="py-3 px-6 text-center">{a.termMonths}</td>
              <td className="py-3 px-6 text-center">{a.startDate}</td>
              <td
                className={`py-3 px-6 text-center font-semibold ${
                  a.status === "ACTIVE"
                    ? "text-green-600"
                    : a.status === "CLOSED"
                    ? "text-gray-600"
                    : "text-yellow-600"
                }`}
              >
                {a.status}
              </td>
              <td className="py-3 px-6 text-center space-x-2">
                <button
                  onClick={() => handleViewSchedule(a.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Schedule
                </button>
                <button
                  onClick={() => handleViewPayments(a.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Payments
                </button>
                <button
                  onClick={() => handleCloseAccount(a.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
