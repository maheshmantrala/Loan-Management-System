import { fetchWithAuth } from "./fetchWithAuth";
const BASE = import.meta.env.VITE_SERVICING;

/** 🔹 Get all accounts (optionally filtered by customerId) */
export const listAccounts = (customerId) =>
  fetchWithAuth(`${BASE}/accounts${customerId ? `?customerId=${customerId}` : ""}`);

/** 🔹 Get single account by ID */
export const getAccount = (id) =>
  fetchWithAuth(`${BASE}/accounts/${id}`);

/** 🔹 Create new loan account */
export const createAccount = (payload) =>
  fetchWithAuth(`${BASE}/accounts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** 🔹 Update account status (ACTIVE, CLOSED, DELINQUENT) */
export const updateAccountStatus = (id, status) =>
  fetchWithAuth(`${BASE}/accounts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

/** 🔹 Delete account */
export const deleteAccount = (id) =>
  fetchWithAuth(`${BASE}/accounts/${id}`, { method: "DELETE" });

/** 🔹 Get repayment schedule for an account */
export const getSchedule = (accountId) =>
  fetchWithAuth(`${BASE}/accounts/${accountId}/schedule`);

/** 🔹 List all payments for an account */
export const listPayments = (accountId) =>
  fetchWithAuth(`${BASE}/accounts/${accountId}/payments`);

/** 🔹 Get specific payment record */
export const getPayment = (accountId, paymentId) =>
  fetchWithAuth(`${BASE}/accounts/${accountId}/payments/${paymentId}`);

/** 🔹 Post a new payment */
export const postPayment = (accountId, payload) =>
  fetchWithAuth(`${BASE}/accounts/${accountId}/payments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** 🔹 Custom helper: list all payments across all accounts of a customer */
export const listPaymentsByCustomer = async (customerId) => {
  // Get all accounts for the customer first
  const accounts = await listAccounts(customerId);
  const allPayments = [];

  // Loop each account to fetch payments
  for (const acc of accounts || []) {
    const payments = await listPayments(acc.id);
    payments.forEach((p) =>
      allPayments.push({ ...p, accountId: acc.id })
    );
  }

  return allPayments;
};
