// src/lib/auth.ts
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Define the shape of the data we store in the JWT payload
interface UserPayload {
  userId: string;
  name: string;
  email: string;
}

// This function gets the authentication token from the browser's cookies.
// It's designed to be used in Server Components.
export function getAuthToken(): string | undefined {
  const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies);
  return cookieStore.get('token')?.value;
}

// This function decodes the JWT and returns the user payload, or null if invalid.
export function getUserFromToken(token: string): UserPayload | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    return payload;
  } catch {
    return null;
  }
}
