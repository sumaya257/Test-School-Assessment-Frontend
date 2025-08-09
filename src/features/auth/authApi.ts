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

interface AuthResponse {
  user?: User;
  accessToken: string;
  id?: string;
  email?: string;
  role?: Role;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' }),
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
