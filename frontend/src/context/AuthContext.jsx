import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
  });

  useEffect(() => {
    if (authData.token) {
      localStorage.setItem("token", authData.token);
      localStorage.setItem("role", authData.role);
    }
  }, [authData]);

  const logout = () => {
    setAuthData({ token: null, role: null });
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Correct named export
export function useAuthContext() {
  return useContext(AuthContext);
}
