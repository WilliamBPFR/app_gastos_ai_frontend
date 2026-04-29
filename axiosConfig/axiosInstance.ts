import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      globalThis.location.pathname !== "/"
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/auth/refresh");

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        globalThis.location.href = "/";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);