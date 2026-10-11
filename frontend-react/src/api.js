const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !configuredApiUrl) {
  throw new Error("VITE_API_URL must be set for a production build.");
}

const apiBaseUrl = (configuredApiUrl || "http://localhost:5000").replace(/\/+$/, "");

export const API_URLS = {
  transactions: `${apiBaseUrl}/api/transactions`,
  savingsGoals: `${apiBaseUrl}/api/savings-goals`,
  login: `${apiBaseUrl}/api/auth/login`,
  register: `${apiBaseUrl}/api/auth/register`,
};