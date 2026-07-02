// In development the Vite proxy forwards /api to the local server.
// In production, point VITE_API_URL at the deployed API (including /api).
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.PROD
    ? "https://community-garden-app-react-production.up.railway.app/api"
    : "/api");
