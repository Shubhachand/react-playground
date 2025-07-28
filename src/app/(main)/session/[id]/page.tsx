// src/app/(main)/session/[id]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth'; // renamed for clarity
import Playground from '@/components/playground/Playground';
import type { Session } from '@prisma/client';

export default async function SessionPage({ params }: { params: { id: string } }) {
  // 1. Get token from cookies (server-side)
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  // 2. Verify token (safely)
  const user = verifyJwtToken(token);
  if (!user || !user.userId) redirect('/login');

  // 3. Fetch session from DB
  const session: Session | null = await prisma.session.findUnique({
    where: {
      id: params.id,
      userId: user.userId,
    },
  });

  if (!session) redirect('/');

  // 4. Render page
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{session.name}</h1>
      <Playground session={session} />
    </div>
  );
}
