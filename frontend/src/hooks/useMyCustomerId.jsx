import { useEffect, useState } from "react";

// Minimal resolver for now.
// In production: get customerId from your /auth/me or login response.
export default function useMyCustomerId(username) {
  const [customerId, setCustomerId] = useState(
    localStorage.getItem("customerId") || ""
  );

  useEffect(() => {
    if (customerId) localStorage.setItem("customerId", customerId);
  }, [customerId]);

  return { customerId, setCustomerId };
}
