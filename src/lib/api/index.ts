/**
 * API Module
 * Main export file for all API-related functionality
 */

// Export API client
export { apiClient, ApiClientError, default as ApiClient } from "./client";

// Export configuration
export { API_CONFIG, API_ENDPOINTS } from "./config";

// Export types
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginatedResponse,
  RequestConfig,
} from "./types";

// Export services
export * from "./services";

// Export hooks
export { useApi, useMutation } from "./hooks/useApi";
export type { UseApiState } from "./hooks/useApi";
