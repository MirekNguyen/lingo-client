import axios from "axios"

// Use environment variable for API base URL, fallback to mock
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "mock"
export const USE_MOCK = API_BASE_URL === "mock"

// Create axios instance for real API calls
export const apiClient = axios.create({
  baseURL: API_BASE_URL === "mock" ? undefined : API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})
