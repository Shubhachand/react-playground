// src/app/api/sessions/[id]/route.ts
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles PUT requests to /api/sessions/:id.
 * This function is for updating an existing session with new data from the auto-save feature.
 */
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // 1. Authenticate the user from their token.
  const token = getAuthToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // 2. Get the new session data from the request body.
    const body = await req.json();
    const { name, chatHistory, jsxCode, cssCode } = body;
    const sessionId = params.id;

    // 3. Security Check: Verify that the session being updated belongs to the logged-in user.
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: user.userId,
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // 4. Update the session in the database.
    const updatedSession = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        name,
        chatHistory,
        jsxCode,
        cssCode,
      },
    });

    return NextResponse.json(updatedSession, { status: 200 });
  } catch (error) {
    console.error('UPDATE_SESSION_ERROR', error);
    return NextResponse.json(
      { message: 'Failed to update session' },
      { status: 500 }
    );
  }
}
