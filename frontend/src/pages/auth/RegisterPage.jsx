import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { register } from "../../api/authenticationApi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CUSTOMER",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);
  const navigate = useNavigate();

  // Quotes and rotating features
  const quotes = [
    { text: "“Financial freedom begins with smart planning.”", author: "– MyLoans Team" },
    { text: "“The best investment you can make is in yourself.”", author: "– Warren Buffett" },
    { text: "“Your credit history is your financial reputation — build it wisely.”", author: "– Unknown" },
  ];

  const features = [
    { icon: "⚡", title: "Instant Account Setup", desc: "Create your loan account in seconds with quick verification." },
    { icon: "🔐", title: "Secure Platform", desc: "Your personal data and documents are protected with 256-bit encryption." },
    { icon: "📊", title: "Smart Loan Insights", desc: "Get AI-based recommendations to manage your credit better." },
    { icon: "💰", title: "Flexible EMI Options", desc: "Customize your repayment schedule according to your budget." },
  ];

  useEffect(() => {
    const quoteTimer = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 5000);
    const featureTimer = setInterval(() => setFeatureIndex((i) => (i + 1) % features.length), 4000);
    return () => {
      clearInterval(quoteTimer);
      clearInterval(featureTimer);
    };
  }, []);

  // ✅ Handle registration
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const responseMessage = await register(form);
      setMessage(responseMessage);
      if (responseMessage.toLowerCase().includes("success")) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
      {/* LEFT PANEL */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center text-center p-10 bg-blue-700 text-white md:rounded-r-[60px] shadow-lg"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold mb-3 mt-8"
        >
          Join MyLoans Today
        </motion.h1>

        <p className="text-lg max-w-md mb-6">
          Experience seamless digital lending — faster, smarter, and more transparent.
        </p>

        {/* Animated Quote */}
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

        {/* Animated Features */}
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

      {/* RIGHT PANEL — REGISTER FORM */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
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
            Create an Account
          </h2>

          {message && <p className="text-green-600 text-sm mb-2 text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded focus:outline-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded focus:outline-blue-500"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </motion.button>

          <p className="text-sm text-center mt-3 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
