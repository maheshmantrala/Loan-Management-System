import { listCustomers } from "./customerApi";
const BASE_ORIGINATION = import.meta.env.VITE_ORIGINATION;
const BASE_SERVICING = import.meta.env.VITE_SERVICING;

export async function fetchAdminStats() {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Customers
    const customers = await listCustomers();
    const totalCustomers = customers.length;

    // Applications
    const appsRes = await fetch(`${BASE_ORIGINATION}/applications`, { headers });
    if (!appsRes.ok) throw new Error(`Applications fetch failed: ${appsRes.status}`);
    const applications = await appsRes.json();
    if (!Array.isArray(applications)) throw new Error("Invalid applications response");

    // Accounts
    const accountsRes = await fetch(`${BASE_SERVICING}/accounts`, { headers });
    if (!accountsRes.ok) throw new Error(`Accounts fetch failed: ${accountsRes.status}`);
    const accounts = await accountsRes.json();
    if (!Array.isArray(accounts)) throw new Error("Invalid accounts response");

    // Calculate stats
    const approvedApps = applications.filter(a => a.status === "APPROVED").length;
    const pendingApps = applications.filter(a => a.status === "PENDING").length;

    return {
      totalCustomers,
      totalApplications: applications.length,
      approvedApps,
      pendingApps,
      totalAccounts: accounts.length,
    };
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    throw error;
  }
}
