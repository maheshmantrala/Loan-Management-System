import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyCustomerProfile } from "../api/customerApi";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch once at app load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const prof = await getMyCustomerProfile();
        setProfile(prof);
        if (prof?.customerId) setCustomerId(prof.customerId);
        localStorage.setItem("customerId", prof?.customerId || "");
      } catch (err) {
        console.log("No customer profile found yet.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        profile,
        setProfile,
        customerId,
        setCustomerId,
        loading,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);
