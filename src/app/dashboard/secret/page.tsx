// app/dashboard/secret/page.tsx
import axiosServer from '@/lib/axios-server';
import Link from 'next/link';

export default async function SecretPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

  try {
    const res = await axiosServer.get('/api/echo-token');
    result = res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    result = { error: err.message };
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-red-600">
        🔒 Secret (SSR)
      </h1>
      <p className="text-gray-600 mb-4">
        This page was rendered on the <strong>server</strong> using
        <code> axiosServer </code> to call <code>/api/echo-token</code>.
      </p>

      <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(result, null, 2)}
      </pre>

      <Link href='/dashboard'>back to dashboard</Link>
    </div>
  );
}
