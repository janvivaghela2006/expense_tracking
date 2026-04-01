import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("expense-tracker-auth");

  if (authData) {
    const parsed = JSON.parse(authData);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});
