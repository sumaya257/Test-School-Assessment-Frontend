import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from './authSlice';

export type Role = 'student' | 'admin' | 'supervisor';

interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshTokenPayload {
  refreshToken: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (getState() as any).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterPayload>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.query<{ message: string }, string>({
      query: (token) => `auth/verify-email?token=${token}`,
    }),
    login: builder.mutation<TokenResponse, LoginPayload>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<TokenResponse, RefreshTokenPayload>({
      query: (body) => ({
        url: 'auth/token',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      query: (body) => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),
    }),
    sendOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: 'auth/send-otp',
        method: 'POST',
        body,
      }),
    }),
    resendOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: 'auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordPayload>({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordPayload>({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailQuery,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
