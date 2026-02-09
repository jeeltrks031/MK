"use client";

import { useEffect, useState, useCallback } from "react";
import type { ApiResponse } from "../types";
import { ApiClientError } from "../client";

/**
 * API Call State
 */
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Custom hook for API calls
 * Handles loading, error, and success states
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  immediate = true,
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
    success: false,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();

      if (response.success && response.data !== undefined) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message || response.error || "Unknown error occurred",
          success: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiClientError
          ? error.message
          : "An unexpected error occurred";

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false,
      });
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE)
 * Returns a function to trigger the API call
 */
export function useMutation<T, P = void>(
  apiCall: (params: P) => Promise<ApiResponse<T>>,
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const mutate = useCallback(
    async (params: P) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall(params);

        if (response.success && response.data !== undefined) {
          setState({
            data: response.data,
            loading: false,
            error: null,
            success: true,
          });
          return response.data;
        } else {
          const errorMessage =
            response.message || response.error || "Unknown error occurred";
          setState({
            data: null,
            loading: false,
            error: errorMessage,
            success: false,
          });
          throw new Error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error instanceof ApiClientError
            ? error.message
            : error instanceof Error
              ? error.message
              : "An unexpected error occurred";

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });
        throw error;
      }
    },
    [apiCall],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
