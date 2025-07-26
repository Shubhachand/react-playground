// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the request body
    const body = await req.json();
    const { email, password } = body;

    // 2. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 3. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Use a generic message to prevent attackers from knowing which emails are registered
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 } // Unauthorized
      );
    }

    // 4. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 5. If credentials are valid, create a JWT
    // The token "payload" contains information we want to encode.
    const payload = {
      userId: user.id,
      email: user.email,
    };

    // Sign the token with a secret key from your environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1d', // Token will expire in 1 day
    });

    // 6. Return the token to the client
    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });

  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
