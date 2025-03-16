import { PrismaClient, Prisma } from '@prisma/client';

let prismaClientInstance: PrismaClient | undefined;

// Get Prisma client instance for database connection
export function getPrismaClient(connectionString: string): PrismaClient {
  if (!prismaClientInstance) {
    prismaClientInstance = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });
  }

  return prismaClientInstance;
}

export { Prisma };
