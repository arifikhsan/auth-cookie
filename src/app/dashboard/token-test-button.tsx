'use client';

import axiosClient from '@/lib/axios-client';
import { useState } from 'react';

export default function TokenTestButton() {
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const res = await axiosClient.get('/api/echo-token');
      setResponse(JSON.stringify(res.data, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setResponse('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleClick}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        🔍 Test Access Token
      </button>

      {response && (
        <pre className="mt-4 p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap break-words">
          {response}
        </pre>
      )}
    </div>
  );
}
