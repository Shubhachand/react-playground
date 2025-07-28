// src/app/(main)/session/[id]/page.tsx
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Playground from '@/components/playground/Playground';

// By removing the custom 'PageProps' type and defining the props inline,
// we avoid conflicts with Next.js's internal type generation.
export default async function SessionPage({ params }: { params: { id: string } }) {
  const token = getAuthToken();
  if (!token) {
    return redirect('/login');
  }

  const user = getUserFromToken(token);
  if (!user) {
    return redirect('/login');
  }

  // TypeScript can correctly infer the type of 'session' from the Prisma client.
  const session = await prisma.session.findUnique({
    where: {
      id: params.id,
      // Security check: ensure the session belongs to the logged-in user.
      userId: user.userId,
    },
  });

  // If the session doesn't exist or doesn't belong to the user, redirect to the dashboard.
  if (!session) {
    return redirect('/');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.name}</h1>
      <Playground session={session} />
    </div>
  );
}
