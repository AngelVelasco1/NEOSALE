/**
 * Optimized API Client using Fetch
 * Type-safe HTTP wrapper with error handling, auth, and retry logic
 */

import { getAuthToken } from "./auth-helpers";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiClientOptions {
  method?: HttpMethod;
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  token?: string;
  cache?: RequestCache;
  revalidate?: number; // ISR revalidation time
  skipAuth?: boolean; // Skip automatic auth token injection
}

interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  validationErrors?: Record<string, string | string[]>;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(baseUrl: string = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || "") : "") {
    this.baseUrl = baseUrl;
  }

  /**
   * Make HTTP request with retry logic and error handling
   */
  private async request<T = Record<string, unknown>>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      body,
      headers = {},
      token,
      skipAuth = false,
      cache = "no-cache",
    } = options;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Auto-inject auth token in server actions if not explicitly skipped
    let authToken = token ?? null;
    if (!skipAuth && !authToken) {
      try {
        authToken = (await getAuthToken()) ?? null;
      } catch (error) {
        console.warn("[apiClient] Failed to get auth token:", error);
      }
    }

    // Add auth token if available
    if (authToken) {
      requestHeaders["Authorization"] = `Bearer ${authToken}`;
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      requestInit.body =
        body instanceof FormData ? body : JSON.stringify(body);
      // FormData sets its own Content-Type with boundary
      if (body instanceof FormData) {
        delete requestHeaders["Content-Type"];
      }
    }

    let lastError: Error | null = null;
    const maxRetries = 1; // Retry once on network failure, not on 4xx/5xx

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await fetch(url, requestInit);
        const contentType = response.headers.get("content-type");
        let data: Record<string, unknown> | string | Blob | null = null;

        if (contentType?.includes("application/json")) {
          data = await response.json();
        } else if (contentType?.includes("text")) {
          data = await response.text();
        } else {
          data = await response.blob();
        }

        // If response is not ok, return error response
        if (!response.ok) {
          return {
            success: false,
            status: response.status,
            error: (data as Record<string, unknown>)?.error || (data as Record<string, unknown>)?.message || `HTTP ${response.status}`,
            validationErrors: (data as Record<string, unknown>)?.validationErrors as Record<string, string | string[]>,
            message: (data as Record<string, unknown>)?.message as string,
          } as ApiResponse<T>;
        }

        // Success response
        return {
          success: (data as Record<string, unknown>)?.success !== false, // Default to true if not specified
          data: ((data as Record<string, unknown>)?.data || data) as T,
          status: response.status,
          message: (data as Record<string, unknown>)?.message as string,
        } as ApiResponse<T>;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Only retry on network errors, not on response errors
        if (i === maxRetries) {
          return {
            success: false,
            status: 0,
            error: `Network error: ${lastError.message}`,
          } as ApiResponse<T>;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 100 * (i + 1)));
      }
    }

    return {
      success: false,
      status: 0,
      error: lastError?.message || "Unknown error",
    } as ApiResponse<T>;
  }

  /**
   * GET request
   */
  async get<T = Record<string, unknown>>(
    endpoint: string,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { body, ...options, method: "POST" });
  }

  /**
   * PUT request
   */
  async put<T = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { body, ...options, method: "PUT" });
  }

  /**
   * PATCH request
   */
  async patch<T = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { body, ...options, method: "PATCH" });
  }

  /**
   * DELETE request
   */
  async delete<T = Record<string, unknown>>(
    endpoint: string,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Upload file with multipart form-data
   */
  async uploadFile<T = Record<string, unknown>>(
    endpoint: string,
    formData: FormData,
    token?: string,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const headers = { ...customHeaders };
    // Remove Content-Type for FormData (browser will set it with boundary)
    delete headers["Content-Type"];

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
      token,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for custom instance creation if needed
export default ApiClient;
