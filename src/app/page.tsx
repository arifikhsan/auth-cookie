import { cookies } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
  const cookieStore = await cookies();

  // build the cookie header manually
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const res = await fetch(`${process.env.APP_URL}/api/me`, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader, // ✅ forward cookies manually
    },
  });
  const data = await res.json();
  const user = data;

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Next.js Auth Cookie Demo</h1>

      {user ? (
        <>
          <p>Welcome back, {JSON.stringify(user)}</p>
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
    </main>
  );
}
