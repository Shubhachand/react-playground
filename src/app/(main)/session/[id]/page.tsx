// src/app/(main)/session/[id]/page.tsx
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Playground from '@/components/playground/Playground';

// FIX: The page component must be async to access dynamic params.
export default async function SessionPage({ params }: { params: { id: string } }) {
  const token =  getAuthToken();
  if (!token) redirect('/login');

  const user = getUserFromToken(token);
  if (!user) redirect('/login');

  const session = await prisma.session.findUnique({
    where: {
      id: params.id,
      userId: user.userId,
    },
  });

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
