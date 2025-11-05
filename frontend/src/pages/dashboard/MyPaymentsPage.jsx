import React, { useEffect, useState } from "react";
import {
  listAccounts,
  listPayments,
  postPayment,
  getSchedule,
} from "../../api/servicingApi";
import { listApplicationsByCustomer } from "../../api/originationApi";
import { toast } from "react-toastify";

export default function MyPaymentsPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [payments, setPayments] = useState([]);
  const [nextDue, setNextDue] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Logged-in customer ID
  const customerId = localStorage.getItem("customerId");

  /* -------------------------------------------------------------------------- */
  /* 🟢 1. Load all accounts belonging to this customer                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function loadAccounts() {
      try {
        if (!customerId) {
          toast.error("No customer ID found. Please complete your profile.");
          return;
        }

        console.log("🔍 Loading servicing accounts for customer:", customerId);
        let res = await listAccounts(customerId);
        console.log("✅ Servicing accounts response:", res);

        // Fallback: if no servicing accounts, check origination
        if (!res || res.length === 0) {
          console.warn("⚠️ No servicing accounts found, checking origination...");
          const apps = await listApplicationsByCustomer(customerId);
          console.log("🧾 Origination applications:", apps);

          // 🔹 Only include approved/disbursed/active applications
          const approved = (apps || []).filter((a) =>
            ["APPROVED", "DISBURSED", "ACTIVE"].includes(
              (a.status || "").toUpperCase()
            )
          );

          // 🔹 Convert to servicing-like structure for dropdown
          res = approved.map((a) => ({
            id: a.id,
            loanType: a.loanType || a.loan_type || "Loan",
            principal: a.loanAmount || a.loan_amount || 0,
            fromOrigination: true,
          }));

          if (res.length === 0) {
            toast.info("No approved or active loan applications found yet.");
          }
        }

        setAccounts(res || []);
      } catch (err) {
        console.error("❌ Error loading accounts:", err);
        toast.error("Failed to load your loan accounts.");
      }
    }
    loadAccounts();
  }, [customerId]);

  /* -------------------------------------------------------------------------- */
  /* 🟢 2. When account selected → load its payments & next due installment     */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function loadPaymentsAndSchedule() {
      if (!selectedAccount) return;
      try {
        console.log("📥 Loading payments and schedule for account:", selectedAccount);
        const [payRes, schedRes] = await Promise.all([
          listPayments(selectedAccount),
          getSchedule(selectedAccount),
        ]);

        setPayments(payRes || []);

        // Find next unpaid installment
        const next = (schedRes || []).find((i) => i.status !== "PAID");
        setNextDue(next || null);
      } catch (err) {
        console.error(err);
        toast.error("Error loading payments or schedule.");
      }
    }
    loadPaymentsAndSchedule();
  }, [selectedAccount]);

  /* -------------------------------------------------------------------------- */
  /* 🟢 3. Make a payment for the selected account                              */
  /* -------------------------------------------------------------------------- */
  const handleMakePayment = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !amount) {
      toast.warn("Please select an account and enter an amount.");
      return;
    }

    try {
      setLoading(true);
      await postPayment(selectedAccount, {
        amount: parseFloat(amount),
        paymentDate: new Date().toISOString(),
        mode: "ONLINE",
      });
      toast.success("Payment successful!");
      setAmount("");

      // Refresh payment list & next due
      const [payRes, schedRes] = await Promise.all([
        listPayments(selectedAccount),
        getSchedule(selectedAccount),
      ]);
      setPayments(payRes || []);
      const next = (schedRes || []).find((i) => i.status !== "PAID");
      setNextDue(next || null);
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧱 UI Rendering                                                            */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Payments</h1>

      {/* Loan Account Selection */}
      <div className="bg-white p-5 rounded-xl shadow">
        <label className="block mb-2 font-medium text-gray-700">
          Select Loan Account
        </label>
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="">-- Select Account --</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.loanType || "Loan"} — #{a.id} — ₹
              {Number(a.principal).toLocaleString("en-IN")}
              {a.fromOrigination ? " (Origination)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Next Due Summary */}
      {selectedAccount && nextDue && (
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Next EMI Due
          </h2>
          <p className="text-gray-700">
            <strong>Date:</strong>{" "}
            {new Date(nextDue.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Amount:</strong> ₹
            {Number(nextDue.installmentAmount).toLocaleString("en-IN")}
          </p>
        </div>
      )}

      {/* Make Payment Form */}
      {selectedAccount && (
        <form
          onSubmit={handleMakePayment}
          className="bg-white p-5 rounded-xl shadow space-y-4"
        >
          <h2 className="text-lg font-semibold">Make a Payment</h2>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter payment amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}

      {/* Payment History */}
      {selectedAccount && payments.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Mode</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={p.id || idx} className="border-t">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">₹{p.amount}</td>
                  <td className="p-2 border">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{p.mode || "ONLINE"}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        p.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status || "SUCCESS"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No payments found */}
      {selectedAccount && payments.length === 0 && (
        <div className="text-gray-500 italic">
          No payments found for this account yet.
        </div>
      )}
    </div>
  );
}
