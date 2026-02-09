/**
 * Common API Types
 * Shared types for API requests and responses
 */

import { PaginationInfo } from "./services";

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  pagination?: PaginationInfo;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

/**
 * Request configuration options
 */
export interface RequestConfig extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}
