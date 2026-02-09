import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type { ApiResponse } from "../types";

export interface LoginOrRegisterRequest {
  phoneNumber: string;
  countryCode: string;
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  countryCode: string;
  otp: string;
}

export interface ResendOTPRequest {
  phoneNumber: string;
  countryCode: string;
  type: "login" | "register";
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phoneNumber: string;
    countryCode: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  message?: string;
}

export const authService = {
  /**
   * Login or Register
   * POST /api/users/login-or-register
   */
  loginOrRegister: async (
    data: LoginOrRegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN_OR_REGISTER,
      data,
      { skipAuth: true },
    );
  },

  /**
   * Verify OTP
   * POST /api/users/verify-otp
   */
  verifyOTP: async (
    data: VerifyOTPRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, data, {
      skipAuth: true,
    });
  },

  /**
   * Resend OTP
   * POST /api/users/resend-otp
   */
  resendOTP: async (
    data: ResendOTPRequest,
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      data,
      { skipAuth: true },
    );
  },
};
