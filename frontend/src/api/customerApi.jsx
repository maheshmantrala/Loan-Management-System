import { fetchWithAuth } from "./fetchWithAuth";
const BASE = import.meta.env.VITE_CUSTOMER;

/** 🔹 List all customers (admin use) */
export const listCustomers = () =>
  fetchWithAuth(`${BASE}/api/customers`);

/** 🔹 Create new customer (admin or self-registration) */
export const createCustomer = (data) =>
  fetchWithAuth(`${BASE}/api/customers`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** 🔹 Get customer by ID */
export const getCustomerById = (id) =>
  fetchWithAuth(`${BASE}/api/customers/${id}`);

/** 🔹 Update existing customer */
export const updateCustomer = (id, data) =>
  fetchWithAuth(`${BASE}/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

/** 🔹 Delete customer */
export const deleteCustomer = (id) =>
  fetchWithAuth(`${BASE}/api/customers/${id}`, {
    method: "DELETE",
  });

/** 🔹 Get logged-in customer profile */
export const getMyCustomerProfile = () =>
  fetchWithAuth(`${BASE}/api/customers/me`);

/** 🔹 Create profile for logged-in user */
export const createMyCustomerProfile = (payload) =>
  fetchWithAuth(`${BASE}/api/customers/me`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
