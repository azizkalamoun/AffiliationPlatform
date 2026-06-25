import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default api;
