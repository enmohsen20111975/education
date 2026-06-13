import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    // Reduce connection pool for shared hosting
    __internal: {
      engine: {
        connectionLimit: 1,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db