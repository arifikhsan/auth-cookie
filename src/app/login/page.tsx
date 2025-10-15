'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) router.push('/dashboard');
    else setError('Invalid credentials (try password: 1234)');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-sm">
        <input
          className="border p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="border p-2"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password (use 1234)"
        />
        <button className="bg-blue-500 text-white px-3 py-2 rounded" type="submit">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
