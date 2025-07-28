// src/app/api/sessions/route.ts
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles POST requests to /api/sessions.
 * Creates a new, empty session for the currently authenticated user.
 */
export async function POST(req: NextRequest) {
  const token = getAuthToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const newSession = await prisma.session.create({
      data: {
        userId: user.userId,
        // name, chatHistory, jsxCode, cssCode use default values
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('ERROR_CREATING_SESSION:', error);

    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message || 'Internal server error'
        : 'Failed to create session';

    return NextResponse.json({ message }, { status: 500 });
  }
}
