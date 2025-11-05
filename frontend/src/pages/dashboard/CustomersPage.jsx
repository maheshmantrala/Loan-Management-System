import React, { useEffect, useState } from "react";
import { listCustomers } from "../../api/customerApi";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("❌ Failed to load customers:", err);
        setError("Unable to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">DOB</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Credit Score</th>
                <th className="p-3 text-left">Employment Type</th>
                <th className="p-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customerId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.customerId}</td>
                  <td className="p-3">{c.fullName}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">
                    {c.dob ? new Date(c.dob).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3">{c.address || "—"}</td>
                  <td className="p-3">{c.creditScore ?? "—"}</td>
                  <td className="p-3">{c.employmentType || "—"}</td>
                  <td className="p-3">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleString()
                      : "—"}
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
