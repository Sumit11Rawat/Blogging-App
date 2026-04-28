// src/config/apiConfig.js

/**
 * Centralized API configuration for the frontend.
 * Falls back to localhost in development and uses environment variables in production.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://blogging-app-qot3-5nzzmnc96-rawatsumit2624-2830s-projects.vercel.app";

export default API_BASE_URL;
