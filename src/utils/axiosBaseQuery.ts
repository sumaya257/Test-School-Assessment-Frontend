import axios, { type AxiosRequestConfig } from 'axios';

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }) =>
  async ({ url, method, data, params, token }: AxiosRequestConfig & { token?: string }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return { data: result.data };
    } catch (axiosError: any) {
      const err = axiosError.response?.data || axiosError.message;
      return {
        error: { status: axiosError.response?.status, data: err },
      };
    }
  };
