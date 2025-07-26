// src/app/api/sessions/route.ts
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles POST requests to /api/sessions.
 * Creates a new, empty session for the currently authenticated user.
 */
export async function POST(req: NextRequest) {
  // 1. Get the authentication token from the request cookies.
  const token = getAuthToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate the token and extract the user's data.
  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // 3. Create a new session document in the database, linking it to the user.
    const newSession = await prisma.session.create({
      data: {
        userId: user.userId,
        // The name, chatHistory, jsxCode, and cssCode will use their default values.
      },
    });

    // 4. Return the newly created session object.
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('ERROR_CREATING_SESSION:', error);
    return NextResponse.json(
      { message: 'An internal error occurred while creating the session.' },
      { status: 500 }
    );
  }
}
