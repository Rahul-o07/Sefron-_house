/**
 * API configuration for SEFRON HOUSE.
 *
 * In development, an empty string ("") routes all `/api/*` and `/health` requests
 * through Vite's high-speed internal proxy to http://127.0.0.1:8000.
 * This completely avoids cross-origin CORS overhead, eliminates IPv4 vs IPv6
 * hostname mismatches, and allows seamless mobile/LAN testing.
 *
 * If VITE_API_URL is specified (e.g., deployed backend or custom port),
 * it takes precedence.
 */
export const BACKEND_DIRECT_URL = "http://127.0.0.1:8000"

export const API_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.DEV ? "" : BACKEND_DIRECT_URL)
