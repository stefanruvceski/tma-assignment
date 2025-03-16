import { getPrismaClient, Prisma } from '../prisma.client'; // Adjust path to your file
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
  Prisma: jest.requireActual('@prisma/client').Prisma, // Preserve real Prisma object
}));

describe('getPrismaClient', () => {
  let mockPrismaClient: jest.Mocked<PrismaClient>;
  const connectionString = 'mongodb://test:27017/db';

  beforeEach(() => {
    // Clear mocks and reset singleton instance
    jest.clearAllMocks();
    // Reset the singleton instance by re-importing the module or manipulating the internal variable
    jest.resetModules(); // Reset module cache to clear singleton
    jest.doMock('../prisma.client', () => ({
      getPrismaClient: jest.requireActual('../prisma.client').getPrismaClient,
      Prisma: jest.requireActual('../prisma.client').Prisma,
    }));
    mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    (PrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);
  });

  it('creates a new PrismaClient instance with the correct connection string', () => {
    const client = getPrismaClient(connectionString);

    expect(PrismaClient).toHaveBeenCalledWith({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });
    expect(client).toBe(mockPrismaClient);
  });

  it('returns the same PrismaClient instance on subsequent calls', () => {
    const client1 = getPrismaClient(connectionString);
    const client2 = getPrismaClient('another-string'); // Different string, but should be ignored

    expect(client1).toBe(client2); // Same instance
    expect(PrismaClient).toHaveBeenCalledTimes(1); // Only instantiated once
  });

  it('passes the provided connection string to PrismaClient', () => {
    const customConnectionString = 'postgres://user:pass@localhost:5432/db';
    const client = getPrismaClient(customConnectionString);

    expect(client).toBe(mockPrismaClient);
  });
});
