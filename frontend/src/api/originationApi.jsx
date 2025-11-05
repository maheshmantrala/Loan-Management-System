import { fetchWithAuth } from "./fetchWithAuth";

const BASE = import.meta.env.VITE_ORIGINATION;

/* -------------------------------------------------------------------------- */
/* 🟢 LIST ALL APPLICATIONS (Admin) */
/* -------------------------------------------------------------------------- */
export const listApplications = () =>
  fetchWithAuth(`${BASE}/applications`);

/* -------------------------------------------------------------------------- */
/* 🟢 LIST APPLICATIONS BY CUSTOMER (Customer Dashboard) */
/* -------------------------------------------------------------------------- */
export const listApplicationsByCustomer = (customerId) =>
  fetchWithAuth(`${BASE}/applications/by-customer/${customerId}`);

/* -------------------------------------------------------------------------- */
/* 🟢 GET SINGLE APPLICATION */
/* -------------------------------------------------------------------------- */
export const getApplication = (id) =>
  fetchWithAuth(`${BASE}/applications/${id}`);

/* -------------------------------------------------------------------------- */
/* 🟢 CREATE NEW APPLICATION (Customer use) */
/* -------------------------------------------------------------------------- */
export const createApplication = (payload) =>
  fetchWithAuth(`${BASE}/applications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

/* -------------------------------------------------------------------------- */
/* 🟢 UPDATE STATUS (Admin approves/rejects) */
/* -------------------------------------------------------------------------- */
export const updateApplicationStatus = (id, status) =>
  fetchWithAuth(`${BASE}/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

/* -------------------------------------------------------------------------- */
/* 🔴 DELETE APPLICATION (optional for Admin) */
/* -------------------------------------------------------------------------- */
export const deleteApplication = (id) =>
  fetchWithAuth(`${BASE}/applications/${id}`, {
    method: "DELETE",
  });
