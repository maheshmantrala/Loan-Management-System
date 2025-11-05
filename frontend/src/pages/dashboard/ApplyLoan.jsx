import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { createApplication } from "../../api/originationApi";
import { useAuthContext } from "../../context/AuthContext";
import useMyCustomerId from "../../hooks/useMyCustomerId";

export default function ApplyLoan() {
  const { authData } = useAuthContext();
  const username = localStorage.getItem("username") || "";
  const { customerId } = useMyCustomerId(username);

  const [searchParams] = useSearchParams();
  const typeFromQuery = searchParams.get("type"); // e.g., ?type=home

  const [form, setForm] = useState({
    loanType: "",
    amount: "",
    termMonths: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Auto-fill loanType from query param if provided
  useEffect(() => {
    if (typeFromQuery) {
      setForm((prev) => ({ ...prev, loanType: typeFromQuery.toUpperCase() }));
    }
  }, [typeFromQuery]);

  // ✅ Automatically decide interest rate based on loan type
  const getInterestRate = (loanType) => {
    switch (loanType.toUpperCase()) {
      case "HOME":
        return 8.5;
      case "CAR":
        return 9.75;
      case "PERSONAL":
        return 12.5;
      default:
        return 10.0;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.loanType || !form.amount || !form.termMonths) {
      alert("Please fill all required fields.");
      return;
    }

    if (!customerId) {
      alert("Please create your customer profile before applying for a loan.");
      return;
    }

    const payload = {
      customerId,
      loanType: form.loanType.toUpperCase(),
      amount: parseFloat(form.amount),
      termMonths: parseInt(form.termMonths, 10),
      interestRate: getInterestRate(form.loanType),
      status: "DRAFT",
    };

    try {
      setLoading(true);
      await createApplication(payload);
      setMessage("✅ Loan application submitted successfully!");
      setForm({ loanType: "", amount: "", termMonths: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit loan application. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Apply for a Loan
      </h2>

      <p className="text-gray-600 mb-6">
        Welcome, <b>{username}</b>! Fill out the details below to apply for your loan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Loan Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Loan Type
          </label>
          <select
            name="loanType"
            value={form.loanType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">-- Select Loan Type --</option>
            <option value="HOME">Home Loan</option>
            <option value="CAR">Car Loan</option>
            <option value="PERSONAL">Personal Loan</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Term */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Term (Months)
          </label>
          <input
            type="number"
            name="termMonths"
            value={form.termMonths}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Auto Interest Rate */}
        {form.loanType && (
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
            Interest Rate for {form.loanType} Loan:{" "}
            <b>{getInterestRate(form.loanType)}%</b>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 text-center font-medium ${
            message.startsWith("✅") ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
