import React, { useState } from 'react';
import { useLoginMutation } from '../services/api';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks';
import { Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(loginSuccess({ user: res.user, token: res.accessToken }));
      alert('Login successful');
    } catch (err: any) {
      dispatch(loginFailure(err.data?.message || 'Login failed'));
      alert(err.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-md shadow p-6 w-full max-w-md border border-gray-200"
        aria-label="Login form"
      >
        <h2 className="text-xl font-semibold mb-5 text-gray-800 text-center">Login</h2>

        {/* Email input */}
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
          Email
        </label>
        <div className="mb-4">
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 text-sm"
          />
        </div>

        {/* Password input with toggle */}
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
          Password
        </label>
        <div className="relative mb-6">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 pr-8 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.958 9.958 0 012.165-6.075M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Forgot password link */}
        <div className="mb-6 text-right">
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-sm py-2 rounded text-white font-semibold transition ${
            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
