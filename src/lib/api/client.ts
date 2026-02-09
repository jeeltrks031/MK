import { API_CONFIG } from "./config";
import type { ApiResponse, ApiError, RequestConfig } from "./types";

/**
 * Custom API Error class
 */
export class ApiClientError extends Error {
  status: number;
  code?: string | number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    code?: string | number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * API Client
 * Centralized fetch wrapper with error handling, timeout, and response parsing
 */
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL || "";
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get authorization token (if using auth)
   * Always reads fresh from localStorage to ensure latest token
   */
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("auth_token");
        return token && token.trim() !== "" ? token : null;
      } catch (error) {
        console.error("Error reading auth token from localStorage:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Build request headers
   */
  private buildHeaders(config?: RequestConfig): HeadersInit {
    const headers = new Headers(this.defaultHeaders);

    // Add auth token if available
    if (!config?.skipAuth) {
      const token = this.getAuthToken();
      if (token && token.trim() !== "") {
        headers.set("Authorization", `Bearer ${token.trim()}`);
      } else {
        console.warn("API call requires authentication but no token found");
      }
    }

    // Merge custom headers
    if (config?.headers) {
      const customHeaders = new Headers(config.headers);
      customHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  /**
   * Build full URL
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    // Ensure baseUrl doesn't end with slash
    const cleanBaseUrl = this.baseUrl.endsWith("/")
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let data: unknown;

    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      throw new ApiClientError("Failed to parse response", response.status);
    }

    if (!response.ok) {
      const error = data as ApiError;

      // Handle 401 Unauthorized - token might be invalid or missing
      if (response.status === 401) {
        // Check if token exists in storage
        const token = this.getAuthToken();
        if (!token) {
          // Token doesn't exist, clear any stale data
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            // Dispatch event to notify auth context
            window.dispatchEvent(new Event("auth-changed"));
          }
        }
      }

      throw new ApiClientError(
        error.message || `Request failed with status ${response.status}`,
        response.status,
        error.code,
        error.errors,
      );
    }

    // If response is already in ApiResponse format, return it
    if (typeof data === "object" && data !== null && "success" in data) {
      return data as ApiResponse<T>;
    }

    // Otherwise wrap it in ApiResponse format
    return {
      success: true,
      data: data as T,
    };
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiClientError("Request timeout", 408);
      }
      throw error;
    }
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint);
      const headers = this.buildHeaders(config);
      const timeout = config.timeout ?? this.defaultTimeout;

      const response = await this.fetchWithTimeout(
        url,
        {
          ...config,
          headers,
        },
        timeout,
      );

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle network errors
      throw new ApiClientError(
        error instanceof Error ? error.message : "Network error occurred",
        0,
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for testing or custom instances
export default ApiClient;
