import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Playground from '@/components/playground/Playground';
import type { Session } from '@prisma/client';

// ✅ Correctly typed for App Router dynamic route
type PageProps = {
  params: {
    id: string;
  };
};

export default async function SessionPage({ params }: PageProps) {
  const token = getAuthToken();
  if (!token) return redirect('/login');

  const user = getUserFromToken(token);
  if (!user) return redirect('/login');

  const session: Session | null = await prisma.session.findUnique({
    where: {
      id: params.id,
      userId: user.userId,
    },
  });

  if (!session) return redirect('/');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.name}</h1>
      <Playground session={session} />
    </div>
  );
}
