// src/app/(main)/layout.tsx
import Header from '@/components/layout/Header';
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const token = getAuthToken();
  if (!token) return redirect('/login');

  const user = getUserFromToken(token);
  if (!user) return redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user.name} />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
