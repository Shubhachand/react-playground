// src/app/(main)/page.tsx
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewSessionButton from '@/components/dashboard/NewSessionButton';

export default async function DashboardPage() {
  const token = getAuthToken();
  if (!token) return redirect('/login');

  const user = getUserFromToken(token);
  if (!user) return redirect('/login');

  const sessions = await prisma.session.findMany({
    where: { userId: user.userId },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">Your Sessions</h2>
        <NewSessionButton />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {sessions.length > 0 ? (
          <ul className="space-y-4">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="border-b pb-4 flex justify-between items-center"
              >
                <div>
                  <Link
                    href={`/session/${session.id}`}
                    className="text-lg font-semibold text-blue-700 hover:underline"
                  >
                    {session.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(session.updatedAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            You don&apos;t have any sessions yet. Click &quot;New Session&quot; to get started!
          </p>
        )}
      </div>
    </div>
  );
}
