import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCustomerById, updateCustomer } from "../../api/customerApi";
import { motion, AnimatePresence } from "framer-motion";

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!customerId) {
          toast.error("No customer ID found. Please log in again.");
          return;
        }
        const data = await getCustomerById(customerId);
        setProfile(data);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        toast.error("Failed to load profile details.");
      }
    }
    loadProfile();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateCustomer(customerId, profile);
      toast.success("Profile updated successfully!");
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return <div className="text-center text-gray-500 mt-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* ---------------- HEADER ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-50 to-emerald-100 rounded-xl p-6 text-gray-800 shadow-sm border border-emerald-50"
      >
        <div className="flex items-center gap-5">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.fullName}`}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Customer ID: {customerId}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ---------------- SUCCESS BANNER ---------------- */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-center shadow-sm border border-emerald-100"
          >
            ✅ Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- VIEW MODE ---------------- */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Username" value={profile.username} />
            <ProfileField label="Full Name" value={profile.fullName} />
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Phone" value={profile.phone} />
            <div className="col-span-2">
              <ProfileField label="Address" value={profile.address} multiline />
            </div>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={() => setEditing(true)}
              className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>
      )}

      {/* ---------------- EDIT MODE ---------------- */}
      <AnimatePresence>
        {editing && (
          <motion.form
            onSubmit={handleSave}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Edit Your Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                name="fullName"
                value={profile.fullName || ""}
                onChange={handleChange}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={profile.email || ""}
                onChange={handleChange}
              />
              <FormInput
                label="Phone"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <FormTextarea
                  label="Address"
                  name="address"
                  value={profile.address || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------ Subcomponents ------------------ */

function ProfileField({ label, value, multiline = false }) {
  return (
    <div>
      <label className="block text-gray-600 font-medium mb-1">{label}</label>
      <div
        className={`border rounded-lg px-3 py-2 bg-gray-50 ${
          multiline ? "min-h-[80px]" : ""
        }`}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-gray-600 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
}

function FormTextarea({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-gray-600 font-medium mb-1">{label}</label>
      <textarea
        name={name}
        rows="3"
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
}
