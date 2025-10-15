import { redirect } from 'next/navigation';
import DashboardComponent from './component';

export default async function DashboardPage() {
  const res = await fetch('http://localhost:3000/api/me', { cache: 'no-store' });
  const data = await res.json();
  const user = data;

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
