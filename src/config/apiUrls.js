// Base addresses of the two backend APIs, read from .env.local (see .env.example).
export const CLIENT_API_URL = import.meta.env.VITE_CLIENT_API_URL;
export const CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

if (!CLIENT_API_URL || !CRM_API_URL) {
  console.error("[config] Missing API URLs — copy .env.example to .env.local");
}
