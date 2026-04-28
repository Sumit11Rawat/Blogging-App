// src/config/apiConfig.js

/**
 * Centralized API configuration for the frontend.
 * Falls back to localhost in development and uses environment variables in production.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

export default API_BASE_URL;
