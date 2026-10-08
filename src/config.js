/**
 * SEFRON HOUSE Backend Configuration
 *
 * Development:
 * Uses the Vite proxy / local setup.
 *
 * Production:
 * Uses VITE_API_URL when provided.
 * Falls back to the live Render backend.
 */

export const BACKEND_DIRECT_URL =
  "https://sefron-house-backend.onrender.com"

export const API_URL =
  import.meta.env.VITE_API_URL !== undefined &&
  import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
      ? ""
      : BACKEND_DIRECT_URL