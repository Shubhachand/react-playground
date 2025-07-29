// src/app/(main)/session/[id]/page.tsx
import { use } from 'react';
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Playground from '@/components/playground/Playground';
import type { Session } from '@prisma/client';

// 👇 If codemod was applied, `params` will be a Promise
export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // extract id using `use()`

  const token = getAuthToken();
  if (!token) return redirect('/login');

  const user = getUserFromToken(token);
  if (!user) return redirect('/login');

  const session = use(
    prisma.session.findUnique({
      where: {
        id,
        userId: user.userId,
      },
    })
  );

  if (!session) return redirect('/');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.name}</h1>
      <Playground session={session as Session} />
    </div>
  );
}
