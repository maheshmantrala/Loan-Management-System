import React, { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useMyCustomerId from "../../hooks/useMyCustomerId";
import { listAccounts, getSchedule } from "../../api/servicingApi";
import { getMyCustomerProfile, createMyCustomerProfile } from "../../api/customerApi";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

export default function CustomerDashboard() {
  const { authData } = useAuthContext();
  const username = localStorage.getItem("username") || "";
  const { customerId, setCustomerId } = useMyCustomerId(username);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    employmentType: "",
    creditScore: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [nextDue, setNextDue] = useState(null);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);
  const [emi, setEmi] = useState({ amount: "", rate: "", tenure: "", result: null });
  const [notifications, setNotifications] = useState([]);
  const [market, setMarket] = useState({ personal: null, car: null, home: null });

  // ✅ Load Profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const prof = await getMyCustomerProfile();
        setProfile(prof);
        if (prof.customerId) setCustomerId(prof.customerId);
      } catch {
        console.log("No profile found — prompting welcome screen.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // ✅ Load Accounts if profile exists
  useEffect(() => {
    if (!customerId) return;
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const accs = await listAccounts(customerId);
        setAccounts(accs || []);
        if (accs?.length) {
          const schedule = await getSchedule(accs[0].id);
          const next = (schedule || []).find((i) => i.status !== "PAID");
          if (next)
            setNextDue({
              accountId: accs[0].id,
              dueDate: next.dueDate,
              amount: next.installmentAmount,
            });
        }
      } catch (e) {
        console.error(e);
        setError("Could not load your account data.");
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, [customerId]);

  // ✅ Mock Offers & Market Data
  useEffect(() => {
    if (!profile) return;
    setOffers([
      { title: "Instant Personal Loan up to ₹5L", rate: 10.5, type: "personal" },
      { title: "Home Loan with 9.2% Interest", rate: 9.2, type: "home" },
      { title: "Car Loan - Fast Approval", rate: 8.7, type: "car" },
    ]);
    setMarket({ personal: 10.5, car: 8.7, home: 9.2 });
  }, [profile]);

  // ✅ Notifications
  useEffect(() => {
    if (!customerId) return;
    setNotifications([
      { id: 1, message: "🎉 Your profile has been verified successfully." },
      { id: 2, message: "💳 New loan offer: Get 1% cashback on processing fees!" },
      { id: 3, message: "📅 EMI due date reminder: No dues currently found." },
    ]);
  }, [customerId]);

  // ✅ Profile Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (form.creditScore && (form.creditScore < 300 || form.creditScore > 900)) {
      alert("Credit score must be between 300 and 900.");
      return;
    }

    try {
      const saved = await createMyCustomerProfile(form);
      alert("Profile created successfully!");
      setProfile(saved);
      setCustomerId(saved.customerId);
    } catch (err) {
      alert("Error creating profile. Please try again.");
      console.error(err);
    }
  };

  // ✅ EMI Calculator
  const calculateEMI = () => {
    const p = emi.amount;
    const r = emi.rate / (12 * 100);
    const n = emi.tenure;
    if (!p || !r || !n) return;

    const result = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const formatted = result.toFixed(2);
    setEmi({ amount: "", rate: "", tenure: "", result: formatted });

    // Clear result after 5s
    setTimeout(() => setEmi({ amount: "", rate: "", tenure: "", result: null }), 5000);
  };

  const totals = useMemo(() => {
    const totalAccounts = accounts.length;
    const active = accounts.filter((a) => a.status === "ACTIVE").length;
    const sumPrincipal = accounts.reduce(
      (s, a) => s + (Number(a.principal) || 0),
      0
    );
    return { totalAccounts, active, sumPrincipal };
  }, [accounts]);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  // ✅ Welcome Screen
  if (!profile && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Welcome to My Loans Portal
        </h1>
        <p className="text-gray-600 mb-6 max-w-xl">
          Manage your loans, payments, and profile with ease.  
          Start your financial journey today with smarter tools and insights.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Create Your Profile
        </button>
      </div>
    );
  }

  // ✅ Profile Creation Form
  if (!profile && showForm) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Create Your Profile
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {["fullName", "email", "phone", "dob", "address", "employmentType", "creditScore"].map((field) => (
            <input
              key={field}
              type={field === "dob" ? "date" : field === "creditScore" ? "number" : "text"}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full p-2 border rounded"
              required={field !== "creditScore"}
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    );
  }

  // ✅ Main Dashboard
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-blue-700 transition"
          onClick={() => navigate("/customer/profile")}
        >
          <span className="text-gray-700 font-medium">
            Welcome, {profile.fullName || username}
          </span>
          <UserCircle size={36} className="text-blue-600 hover:text-blue-700" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5 border">
          <div className="text-gray-500 text-sm">Total Accounts</div>
          <div className="text-3xl font-semibold">{totals.totalAccounts}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border">
          <div className="text-gray-500 text-sm">Active Accounts</div>
          <div className="text-3xl font-semibold text-green-600">{totals.active}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border">
          <div className="text-gray-500 text-sm">Total Principal</div>
          <div className="text-3xl font-semibold">
            ₹{totals.sumPrincipal.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Next Due */}
      <div className="bg-white rounded-xl shadow p-5 border mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm">Next Due</div>
            {nextDue ? (
              <div className="text-lg">
                Account #{nextDue.accountId} — <b>{nextDue.dueDate}</b> —{" "}
                <span className="font-semibold">
                  ₹{Number(nextDue.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            ) : (
              <div className="text-gray-600">No upcoming dues found.</div>
            )}
          </div>
          <a
            href="/customer/loans"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Loans
          </a>
        </div>
      </div>

      {/* 🧩 Loan Offers Section */}
      <div className="bg-white rounded-xl shadow p-5 border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended for You</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div key={offer.title} className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="font-semibold text-blue-700">{offer.title}</div>
              <div className="text-gray-600 text-sm">Interest Rate: {offer.rate}%</div>
              <button
                onClick={() => navigate(`/customer/apply-loan?type=${offer.type}`)}
                className="text-blue-600 mt-2 inline-block hover:underline"
              >
                Apply Now →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ⏰ EMI Calculator */}
      <div className="bg-white rounded-xl shadow p-5 border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">EMI Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Amount (₹)"
            value={emi.amount}
            onChange={(e) => setEmi({ ...emi, amount: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Interest (%)"
            value={emi.rate}
            onChange={(e) => setEmi({ ...emi, rate: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Tenure (Months)"
            value={emi.tenure}
            onChange={(e) => setEmi({ ...emi, tenure: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={calculateEMI}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Calculate
          </button>
          {emi.result && (
            <p className="mt-3 text-gray-700">
              Estimated EMI: <b>₹{emi.result}</b>/month
            </p>
          )}
        </div>
      </div>

      {/* 💳 Credit Health */}
      <div className="bg-white rounded-xl shadow p-5 border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Credit Health</h3>
        <div className="flex items-center gap-4">
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-xl font-bold ${
              profile.creditScore > 750 ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {profile.creditScore || "N/A"}
          </div>
          <p className="text-gray-600 text-sm">
            {profile.creditScore >= 750
              ? "Excellent credit score! You qualify for premium loan offers."
              : "Improve your score to access better interest rates."}
          </p>
        </div>
      </div>

      {/* 🔔 Notifications */}
      <div className="bg-white rounded-xl shadow p-5 border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Notifications</h3>
        {notifications.length ? (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="text-gray-700 text-sm border-b pb-2">{n.message}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No new notifications.</p>
        )}
      </div>

      {/* 📊 Market Insights */}
      <div className="bg-white rounded-xl shadow p-5 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Market Insights</h3>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>🏠 Home Loan Avg Rate: {market.home}%</li>
          <li>🚗 Car Loan Avg Rate: {market.car}%</li>
          <li>💰 Personal Loan Avg Rate: {market.personal}%</li>
        </ul>
        <p className="text-gray-600 text-xs mt-2 italic">
          Tip: Keep your credit utilization under 30% to improve approval chances.
        </p>
      </div>
    </div>
  );
}
