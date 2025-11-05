export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed (${res.status})`);
  }

  // ✅ Safely handle 204 or empty responses
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
