import React, { useState } from 'react';
import { useRegisterMutation } from '../services/api';

export default function Register() {
  const [register] = useRegisterMutation();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, fullName, password }).unwrap();
      alert('Registration successful! Please login.');
    } catch (err: any) {
      alert(err.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded mt-8">
      <h2 className="text-2xl mb-4">Register</h2>
      <input
        type="email"
        required
        placeholder="Email"
        className="border p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 w-full mb-4"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Register
      </button>
    </form>
  );
}
