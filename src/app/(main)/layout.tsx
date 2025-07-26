// src/app/(main)/layout.tsx
import Header from '@/components/layout/Header';
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

// FIX: The layout component must be async to use dynamic server functions like cookies().
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the token from cookies on the server.
  const token = getAuthToken();
  if (!token) {
    // If no token, redirect to login immediately.
    redirect('/login');
  }

  // 2. Validate the token and get user data.
  const user = getUserFromToken(token);
  if (!user) {
    // If token is invalid, redirect to login.
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass the user's name to the Header component */}
      <Header userName={user.name} />
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
