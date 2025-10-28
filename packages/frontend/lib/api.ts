// API client with automatic token refresh

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";
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
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
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
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // If unauthorized, try to refresh token
      if (axiosError.response.status === 401 && requiresAuth) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // Retry request with new token
          const newAccessToken = getAccessToken();
          if (newAccessToken) {
            (requestHeaders as Record<string, string>)[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
          }
          try {
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
          } catch (retryError) {
            const retryAxiosError = retryError as AxiosError;
            clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/entrar";
            }
            throw new ApiError(
              (retryAxiosError.response?.data as any)?.message ||
                "Sessão expirada",
              retryAxiosError.response?.status || 401,
              retryAxiosError.response?.data
            );
          }
        } else {
          // Refresh failed, clear tokens and redirect to login
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/entrar";
          }
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

export async function streamChatMessage(
  message: string,
  onChunk: (chunk: string) => void,
  onImage?: (imageUrl: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    onError?.(new ApiError("Não autenticado", 401));
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/stream`,
      { message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "stream", // Important for streaming
      }
    );

    const reader = response.data; // Axios stream is directly available here

    if (!reader) {
      throw new Error("Nenhum corpo de resposta");
    }

    reader.on("data", (chunk: Buffer) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            continue;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "text") {
              onChunk(parsed.content);
            } else if (parsed.type === "image" && onImage) {
              onImage(parsed.url);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    });

    reader.on("end", () => {
      onComplete?.();
    });

    reader.on("error", (error: Error) => {
      onError?.(
        error instanceof Error ? error : new Error("Erro desconhecido")
      );
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return streamChatMessage(
            message,
            onChunk,
            onImage,
            onComplete,
            onError
          );
        } else {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/entrar";
          }
          onError?.(new ApiError("Sessão expirada", 401));
          return;
        }
      }
      const errorMessage =
        (axiosError.response.data as any)?.message || "Requisição falhou";
      toast({
        title: "Erro no chat",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(
        new ApiError(
          errorMessage,
          axiosError.response.status,
          axiosError.response.data
        )
      );
    } else if (axiosError.request) {
      toast({
        title: "Erro de rede",
        description: "Nenhuma resposta recebida do servidor para o chat.",
        variant: "destructive",
      });
      onError?.(new ApiError("Nenhuma resposta recebida do servidor", 0));
    } else {
      toast({
        title: "Erro inesperado no chat",
        description: axiosError.message,
        variant: "destructive",
      });
      onError?.(new ApiError(axiosError.message, 0));
    }
  }
}
