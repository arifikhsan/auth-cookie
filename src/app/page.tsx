import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default async function HomePage() {
  const token = (await cookies()).get('access_token')?.value;
  const user = verifyToken(token);

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Next.js Auth Cookie Demo</h1>

      {user ? (
        <>
          <p>Welcome back, {user.email}</p>
          <Link href="/dashboard" className="text-blue-500 underline">
            Go to dashboard
          </Link>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </>
      )}
    </main>
  );
}
