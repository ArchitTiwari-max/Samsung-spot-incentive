import { PrismaClient } from '@prisma/client';

// Ensure a single PrismaClient instance across hot reloads in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Only log warnings and errors; disable verbose query logging
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
