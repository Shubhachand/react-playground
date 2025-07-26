// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

// This prevents Prisma from creating too many connections during development
// when Next.js hot-reloads your code. It's a best practice for serverless environments.

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: Log database queries to the console
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
