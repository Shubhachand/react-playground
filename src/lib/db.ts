// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

// This prevents Prisma from creating too many connections during development
// when Next.js hot-reloads your code. It's a best practice for serverless environments.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: Log database queries to the console
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
