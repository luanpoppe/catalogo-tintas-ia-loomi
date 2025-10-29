// API client with automatic token refresh

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getAccessToken, setTokens, clearTokens } from "./auth";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiRequestOptions extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {});

    setTokens({
      accessToken: response.data.accessToken,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...axiosOptions } = options;

  const requestHeaders: AxiosRequestConfig["headers"] = Object.assign(
    { "Content-Type": "application/json" },
    axiosOptions.headers
  );

  if (requiresAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  try {
    return await performRequest(endpoint, axiosOptions, requestHeaders);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Se não autorizado, tenta refrescar o token
      if (axiosError.response.status === 401 && requiresAuth) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // Tenta a requisição novamente com o novo token
          const newAccessToken = getAccessToken();
          if (newAccessToken) {
            (requestHeaders as Record<string, string>)[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
          }
          return await performRequest(endpoint, axiosOptions, requestHeaders);
        } else {
          // Refresh falhou, limpa os tokens e redireciona para o login
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/entrar";
          }
          toast({
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
            variant: "destructive",
          });
          throw new ApiError("Sessão expirada", 401);
        }
      }
      const errorMessage =
        (axiosError.response.data as any)?.message || "Requisição falhou";
      toast({
        title: "Erro na requisição",
        description: errorMessage,
        variant: "destructive",
      });
      throw new ApiError(
        errorMessage,
        axiosError.response.status,
        axiosError.response.data
      );
    } else if (axiosError.request) {
      toast({
        title: "Erro de rede",
        description: "Nenhuma resposta recebida do servidor.",
        variant: "destructive",
      });
      throw new ApiError("Nenhuma resposta recebida do servidor", 0);
    } else {
      toast({
        title: "Erro inesperado",
        description: axiosError.message,
        variant: "destructive",
      });
      throw new ApiError(axiosError.message, 0);
    }
  }
}

async function performRequest<T = any>(
  endpoint: string,
  axiosOptions: AxiosRequestConfig,
  requestHeaders: AxiosRequestConfig["headers"]
): Promise<T> {
  let response: AxiosResponse<T>;
  if (axiosOptions.method === "POST") {
    response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      axiosOptions.data,
      { headers: requestHeaders }
    );
  } else if (axiosOptions.method === "PUT") {
    response = await axios.put(
      `${API_BASE_URL}${endpoint}`,
      axiosOptions.data,
      { headers: requestHeaders }
    );
  } else if (axiosOptions.method === "DELETE") {
    response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      headers: requestHeaders,
    });
  } else {
    response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: requestHeaders,
      params: axiosOptions.params,
    });
  }
  return response.data;
}

export async function sendChatMessage(userMessage: string): Promise<any> {
  return apiRequest("/chat", {
    method: "POST",
    data: { userMessage },
  });
}
