import { PrismaClient } from '@prisma/client';

export abstract class DbEntity<T> {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  get prisma() {
    return this.#prisma;
  }

  abstract create(data: T): Promise<T>;
  abstract update(data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract disconnect(): Promise<void>;
}
