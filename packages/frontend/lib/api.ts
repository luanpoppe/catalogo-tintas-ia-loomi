// API client with automatic token refresh

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })

    return true
  } catch {
    return false
  }
}

export async function apiRequest<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (requiresAuth) {
    const accessToken = getAccessToken()
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`
    }
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  // If unauthorized, try to refresh token
  if (response.status === 401 && requiresAuth) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      // Retry request with new token
      const newAccessToken = getAccessToken()
      if (newAccessToken) {
        headers["Authorization"] = `Bearer ${newAccessToken}`
      }

      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      })
    } else {
      // Refresh failed, clear tokens and redirect to login
      clearTokens()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new ApiError("Session expired", 401)
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(errorData.message || "Request failed", response.status, errorData)
  }

  return response.json()
}

export async function streamChatMessage(
  message: string,
  onChunk: (chunk: string) => void,
  onImage?: (imageUrl: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void,
) {
  const accessToken = getAccessToken()

  if (!accessToken) {
    onError?.(new ApiError("Not authenticated", 401))
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          // Retry with new token
          return streamChatMessage(message, onChunk, onImage, onComplete, onError)
        } else {
          clearTokens()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          throw new ApiError("Session expired", 401)
        }
      }
      throw new ApiError("Request failed", response.status)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error("No response body")
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onComplete?.()
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)

          if (data === "[DONE]") {
            continue
          }

          try {
            const parsed = JSON.parse(data)

            if (parsed.type === "text") {
              onChunk(parsed.content)
            } else if (parsed.type === "image" && onImage) {
              onImage(parsed.url)
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error("Unknown error"))
  }
}
