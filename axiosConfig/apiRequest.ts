import { AxiosRequestConfig, AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";

export async function apiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>
): Promise<TResponse> {
  try {
    const response = await axiosInstance.request<TResponse>(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;

    const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.detail ||
      axiosError.message ||
      "Error inesperado en la petición";

    throw new Error(message);
  }
}