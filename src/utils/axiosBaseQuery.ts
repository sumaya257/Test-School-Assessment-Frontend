// will implement it later
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { setRefreshToken, setToken } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // refresh token দিয়ে নতুন access token আনো
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: 'auth/token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as any;
        api.dispatch(setToken(accessToken));
        api.dispatch(setRefreshToken(newRefreshToken));

        // retry original request
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};
