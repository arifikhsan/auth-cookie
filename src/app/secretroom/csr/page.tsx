'use client';

import { useAuth } from '@/lib/auth-client';
import Link from 'next/link';

export default function SecretRoomCSR() {
    const { status, payload } = useAuth();

    if (status === 'loading') {
        return <div className="p-6 text-gray-500">Loading your access...</div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="p-6 text-red-500">
                You are not logged in. Please <a href="/login" className="underline">login</a>.
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Welcome to the Secret Room (CSR) 🚪</h1>
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
