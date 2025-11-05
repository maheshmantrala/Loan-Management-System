import React, { useEffect, useState } from "react";
import { listApplicationsByCustomer } from "../../api/originationApi";
import useMyCustomerId from "../../hooks/useMyCustomerId";
import { useAuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyLoansPage() {
  const { authData } = useAuthContext();
  const username = localStorage.getItem("username") || "";
  const { customerId } = useMyCustomerId(username);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!customerId) {
        setError("Customer ID not found. Please complete your profile first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await listApplicationsByCustomer(customerId);
        setLoans(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your loan applications.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [customerId]);

  if (loading)
    return <div className="p-8 text-gray-500">Loading your loan applications...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Loan Applications</h1>
        <Link
          to="/customer/apply-loan"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Apply for New Loan
        </Link>
      </div>

      {loans.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-600">
          <p>No loan applications found.</p>
          <Link
            to="/customer/apply-loan"
            className="text-blue-600 hover:underline mt-2 block"
          >
            Click here to apply for your first loan.
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-600">Loan ID</th>
                <th className="p-3 font-semibold text-gray-600">Type</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Amount (₹)</th>
                <th className="p-3 font-semibold text-gray-600 text-center">Term</th>
                <th className="p-3 font-semibold text-gray-600 text-center">Interest</th>
                <th className="p-3 font-semibold text-gray-600 text-center">Status</th>
                <th className="p-3 font-semibold text-gray-600 text-center">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{loan.id}</td>
                  <td className="p-3">{loan.loanType}</td>
                  <td className="p-3 text-right">{Number(loan.amount || 0).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-center">{loan.termMonths} mo</td>
                  <td className="p-3 text-center">{loan.interestRate}%</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        loan.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : loan.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : loan.status === "SUBMITTED"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {loan.createdAt
                      ? new Date(loan.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
