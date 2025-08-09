import React, { useState } from 'react';
import { useLoginMutation } from '../services/api';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks';

export default function Login() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <div className="max-w-3xl mx-auto bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        aria-label="Login form"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

        <input
          type="email"
          required
          placeholder="Email"
          aria-label="Email address"
          className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          placeholder="Password"
          aria-label="Password"
          className="border border-gray-300 p-3 rounded mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
