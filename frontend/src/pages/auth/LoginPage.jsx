import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "../../api/authenticationApi";
import { useAuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);
  const navigate = useNavigate();
  const { setAuthData } = useAuthContext();

  // 💬 Rotating quotes
  const quotes = [
    { text: "“An investment in knowledge pays the best interest.”", author: "– Benjamin Franklin" },
    { text: "“Do not save what is left after spending, but spend what is left after saving.”", author: "– Warren Buffett" },
    { text: "“Your credit score is your financial reputation — protect it wisely.”", author: "– Unknown" },
  ];

  // 🎡 Rotating features
  const features = [
    { icon: "💰", title: "Instant Loan Approvals", desc: "AI-driven eligibility checks within minutes." },
    { icon: "📊", title: "Smart EMI Calculator", desc: "Plan repayments with interactive projections." },
    { icon: "🔒", title: "Secure Document Uploads", desc: "Upload KYC safely with end-to-end encryption." },
    { icon: "🏦", title: "Unified Loan Dashboard", desc: "Track all your accounts and EMIs easily." },
  ];

  useEffect(() => {
    const quoteTimer = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 5000);
    const featureTimer = setInterval(() => setFeatureIndex((i) => (i + 1) % features.length), 4000);
    return () => {
      clearInterval(quoteTimer);
      clearInterval(featureTimer);
    };
  }, []);

  // ✅ Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ username, password });
      const { token, username: userNameFromServer, role, customerId } = res;
      let userRole = role;
      if (!userRole && token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userRole = payload.role || "CUSTOMER";
        } catch {
          userRole = "CUSTOMER";
        }
      }

      setAuthData({ token, role: userRole });
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("username", userNameFromServer || username);
      if (customerId) localStorage.setItem("customerId", customerId);

      navigate(userRole === "ADMIN" ? "/admin" : "/customer");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
      {/* LEFT PANEL */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex flex-col justify-center items-center text-center p-10 bg-blue-700 text-white md:rounded-r-[60px] shadow-lg"
      >
        {/* Headline */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold mb-3 mt-8"
        >
          Welcome to MyLoans
        </motion.h1>

        <p className="text-lg max-w-md mb-6">
          Manage loans, track repayments, and build your financial future — all in one place.
        </p>

        {/* Quotes */}
        <div className="h-28 relative w-full flex justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 p-5 rounded-2xl max-w-md text-center"
            >
              <p className="italic text-lg mb-2">{quotes[quoteIndex].text}</p>
              <p className="text-sm text-gray-200">{quotes[quoteIndex].author}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feature Carousel */}
        <div className="h-28 relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 rounded-2xl p-5 text-left shadow-md max-w-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{features[featureIndex].icon}</span>
                <div>
                  <h4 className="font-semibold text-lg">{features[featureIndex].title}</h4>
                  <p className="text-sm text-gray-200">{features[featureIndex].desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-10 text-xs text-gray-300">
          © {new Date().getFullYear()} MyLoans Financial Services
        </p>
      </motion.div>

      {/* RIGHT PANEL — LOGIN FORM */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex justify-center items-center p-10"
      >
        <motion.form
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
            Login to Continue
          </h2>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-3 rounded focus:outline-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded focus:outline-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </motion.button>

          <p className="text-sm text-center mt-3 text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
