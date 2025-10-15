'use client';
import { useState } from 'react';
import TokenTestButton from './token-test-button';
import Link from 'next/link';

export default function DashboardComponent() {
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    const res = await fetch('/api/refresh', { method: 'POST' });
    if (res.ok) setMessage('✅ Token refreshed!');
    else setMessage('❌ Refresh failed, please log in again.');
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="p-6">
      <p>You are logged in (check token expiry in 10 seconds)</p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleRefresh}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Refresh Token
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {message && <p className="mt-3">{message}</p>}

      <TokenTestButton />
      <Link href='/dashboard/secret'>To secret page</Link>
    </div>
  );
}
