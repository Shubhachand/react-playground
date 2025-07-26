// src/app/api/sessions/[id]/route.ts
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles PUT requests to /api/sessions/:id.
 * Updates an existing session with new data (chat history, code, etc.).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Authenticate the user.
  const token = getAuthToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // 2. Get the session ID from the URL and the new data from the request body.
    const sessionId = params.id;
    const body = await req.json();
    const { name, chatHistory, jsxCode, cssCode } = body;

    // 3. Security Check: Verify that the session being updated actually belongs to the logged-in user.
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: user.userId,
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found or you do not have permission to edit it.' },
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
    console.error('ERROR_UPDATING_SESSION:', error);
    return NextResponse.json(
      { message: 'An internal error occurred while updating the session.' },
      { status: 500 }
    );
  }
}
