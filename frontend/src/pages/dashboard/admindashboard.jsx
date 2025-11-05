import React, { useEffect, useState } from "react";
import { listCustomers } from "../../api/customerApi";
import { listApplications } from "../../api/originationApi";
import { listAccounts } from "../../api/servicingApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    accounts: 0,
  });
  const [activities, setActivities] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 Fetch dashboard + chart data
  const fetchDashboard = async () => {
    try {
      const [customers, apps, accounts] = await Promise.all([
        listCustomers(),
        listApplications(),
        listAccounts(),
      ]);

      const pending = apps.filter((a) => a.status === "PENDING").length;
      const approved = apps.filter((a) => a.status === "APPROVED").length;
      const rejected = apps.filter((a) => a.status === "REJECTED").length;
      const activeAcc = accounts.filter((a) => a.status === "ACTIVE").length;

      setStats({
        customers: customers.length,
        pending,
        approved,
        rejected,
        accounts: activeAcc,
      });

      // 📊 Loan trend data (simulate by creation date)
      const grouped = {};
      accounts.forEach((acc) => {
        const date = new Date(acc.createdAt).toLocaleDateString("en-IN", {
          month: "short",
        });
        grouped[date] = (grouped[date] || 0) + 1;
      });
      const trendArray = Object.entries(grouped).map(([month, count]) => ({
        month,
        count,
      }));
      setTrendData(trendArray);

      // 🧾 Recent activity feed
      const latest = apps
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((a) => ({
          text:
            a.status === "APPROVED"
              ? `✅ Loan #${a.id} approved`
              : a.status === "REJECTED"
              ? `❌ Loan #${a.id} rejected`
              : `📄 New ${a.loanType} loan application`,
          date: a.createdAt,
        }));
      setActivities(latest);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    }
  };

  // 🔁 Auto-refresh every 10s
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 text-blue-600 font-semibold">
        Loading real-time analytics...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">
          Admin Analytics Dashboard
        </h1>
        <span className="text-sm text-gray-500">(auto-refresh every 10s)</span>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <AnimatedStat title="Total Customers" value={stats.customers} color="bg-blue-500" />
        <AnimatedStat title="Pending Apps" value={stats.pending} color="bg-yellow-500" />
        <AnimatedStat title="Approved Loans" value={stats.approved} color="bg-green-500" />
        <AnimatedStat title="Rejected Loans" value={stats.rejected} color="bg-red-500" />
        <AnimatedStat title="Active Accounts" value={stats.accounts} color="bg-purple-500" />
      </div>

      {/* ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PIE CHART: Loan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 rounded-lg shadow border"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Loan Application Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Approved", value: stats.approved },
                  { name: "Pending", value: stats.pending },
                  { name: "Rejected", value: stats.rejected },
                ]}
                outerRadius={100}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#facc15" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LINE CHART: Active Accounts Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 rounded-lg shadow border"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Active Accounts Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* CUSTOMER INSIGHTS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-lg shadow border"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          💡 Customer Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="font-medium">Avg Loans per Customer</p>
            <p className="text-2xl font-bold">
              {(stats.approved / (stats.customers || 1)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-medium">Approval Ratio</p>
            <p className="text-2xl font-bold">
              {((stats.approved / (stats.approved + stats.pending + stats.rejected || 1)) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="font-medium">Active Account Ratio</p>
            <p className="text-2xl font-bold">
              {((stats.accounts / (stats.customers || 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔔 Recent Activity</h2>
        <ul className="space-y-3">
          <AnimatePresence>
            {activities.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg"
              >
                <span className="text-gray-800 text-sm">{a.text}</span>
                <span className="text-xs text-gray-400">
                  {new Date(a.date).toLocaleString()}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🧩 AnimatedStat Helper */
/* -------------------------------------------------------------------------- */
function AnimatedStat({ title, value, color }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.5, type: "spring" }}
      className={`p-6 rounded-lg shadow-md text-white ${color}`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold"
        >
          {value}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
