import { getAuth } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function SecretRoomSSR() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  const { status, payload } = await getAuth(cookieHeader);
  console.log('status secretroom ssr: ', status)

  if (status === 'unauthenticated') {
    return (
      <div className="p-6 text-red-500">
        You are not logged in. Please <a href="/login" className="underline">login</a>.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome to the Secret Room (SSR) 🚪</h1>
      <p className="mt-2">You are logged in as <b>{payload?.email}</b></p>

      <br />
      <Link href={'/'}>Home</Link>
      <br />
      <Link href={'/dashboard'}>Dashboard</Link>
      <br />
      <Link href={'/dashboard/secret'}>Dashboard secret</Link>
      <br />
      <Link href={'/secretroom/csr'}>Secretrom CSR</Link>
      <br />
      <Link href={'/secretroom/ssr'}>Secretrom SSR</Link>
    </div>
  );
}
