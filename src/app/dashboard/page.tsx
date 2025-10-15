import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardComponent from './component';

export default async function DashboardPage() {
  const token = (await cookies()).get('access_token')?.value;
  const user = verifyToken(token);

  if (!user) redirect('/login');

  return (
    <div className="p-6">
      <h1 className="text-xl">Dashboard</h1>
      <p>Logged in as {user.email}</p>
      {/* <form action="/api/logout" method="POST">
        <button className="mt-4 bg-red-500 text-white px-3 py-2 rounded">Logout</button>
      </form> */}
      <DashboardComponent />
    </div>
  );
}
