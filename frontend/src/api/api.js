import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("SIM-USER-JWT");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("SIM-USER-JWT");
      localStorage.removeItem("SIM-USER-EMAIL");
      localStorage.removeItem("SIM-USER-NAME");

      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

export default api;