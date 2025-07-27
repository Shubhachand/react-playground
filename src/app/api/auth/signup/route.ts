// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken'; // <-- Import the JWT library

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // --- NEW: Auto-login the user after signup ---
    // 1. Create a payload for the token.
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    // 2. Sign the token with your secret key.
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    // 3. Return the token along with the success message.
    return NextResponse.json(
      { message: 'User created successfully', token }, // <-- Send token in response
      { status: 201 }
    );

  } catch (error) {
    console.error('SIGNUP_ERROR', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
