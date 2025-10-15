import { cookies } from "next/headers";
import DashboardComponent from "./component";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  // build the cookie header manually
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch("http://localhost:3000/api/me", {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader, // ✅ forward cookies manually
    },
  });
  const data = await res.json();
  const user = data;

  console.log("dashboard: ", data);

  return (
    <div className="p-6">
      <h1 className="text-xl">Dashboard</h1>
      <p>Logged in as {JSON.stringify(user)}</p>
      <DashboardComponent />
    </div>
  );
}
