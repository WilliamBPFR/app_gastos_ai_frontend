import { AxiosRequestConfig, AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";

type ApiErrorData = {
  message?: string;
  detail?: string;
  code?: string;
  details?: unknown;
  [key: string]: unknown;
};

export class ApiRequestError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  data?: ApiErrorData;

  constructor(message: string, options?: {
    status?: number;
    code?: string;
    details?: unknown;
    data?: ApiErrorData;
  }) {
    super(message);
    this.name = "ApiRequestError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
    this.data = options?.data;
  }
}

export async function apiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>
): Promise<TResponse> {
  try {
    const response = await axiosInstance.request<TResponse>(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorData>;
    const responseData = axiosError.response?.data;
    const message =
      responseData?.message ||
      responseData?.detail ||
      axiosError.message ||
      "Error inesperado en la petición";

    throw new ApiRequestError(message, {
      status: axiosError.response?.status,
      code: responseData?.code,
      details: responseData?.details ?? responseData?.detail,
      data: responseData,
    });
  }
}