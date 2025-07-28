// src/app/(main)/session/[id]/page.tsx

import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Playground from '@/components/playground/Playground';

// This is the definitive, simplified structure to fix the build error.
// We define the props directly and avoid any complex or external types.
export default async function SessionPage({ params }: { params: { id: string } }) {
  // --- Authentication and User Fetching ---
  const token = getAuthToken();
  if (!token) {
    // If the user is not logged in, redirect them to the login page.
    return redirect('/login');
  }

  const user = getUserFromToken(token);
  if (!user) {
    // If the token is invalid or expired, also redirect to login.
    return redirect('/login');
  }

  // --- Session Data Fetching ---
  // We fetch the specific session from the database using the ID from the URL.
  const session = await prisma.session.findUnique({
    where: {
      id: params.id,
      // CRITICAL Security Check: We also ensure the session belongs to the currently logged-in user.
      // This prevents one user from accessing another user's session by guessing the URL.
      userId: user.userId,
    },
  });

  // If no session is found (or it doesn't belong to the user), redirect to the main dashboard.
  if (!session) {
    return redirect('/');
  }

  // --- Render the Page ---
  // If everything is successful, render the Playground component and pass the session data to it.
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{session.name}</h1>
      <Playground session={session} />
    </div>
  );
}
