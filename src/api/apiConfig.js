// TODO: missing API — no AfriPlay API base URL/auth scheme documented yet (see /wiki/pages/api-contract.md).
// axios instance below is scaffolded but commented out to avoid an unused dependency until then.

// import axios from "axios";

// export const getApiBaseUrl = () =>
//   import.meta.env.VITE_API_BASE_URL || "https://api.afriplay.example"; // TODO: real base URL

// export const apiClient = axios.create({
//   timeout: 30000,
//   headers: { "Content-Type": "application/json" },
// });

// // Attach auth token — TODO: missing API — auth/token endpoint
// apiClient.interceptors.request.use((config) => {
//   if (!config.baseURL) config.baseURL = getApiBaseUrl();
//   const token = localStorage.getItem("afriplay_access_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const API_READY = false; // flips to true when the real API is wired
