import { AppError } from '@tma-monorepo/error-handling';
import ConfigurationManager, { configKey } from '@tma-monorepo/config';
import { DbEntity } from './db-entity.abstract';
import { getPrismaClient } from '../prisma.client';
import { UserLimit } from '@prisma/client';

export class UserLimitRepository extends DbEntity<UserLimit> {
  constructor() {
    const config = new ConfigurationManager('database');
    super(
      getPrismaClient(config.getValue(configKey.db_connection_string) as string)
    );
  }

  // Create a new user limit
  async create(userlimit: UserLimit): Promise<UserLimit> {
    try {
      const createdUserLimit = await this.prisma.userLimit.create({
        data: userlimit,
      });
      return createdUserLimit;
    } catch (error) {
      throw new AppError(
        '[database] user-limit-create-repository-error',
        `Failed to create user limit: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        404,
        false,
        error instanceof Error ? error : undefined
      );
    }
  }

  // update a user limit
  async update(userLimit: Partial<UserLimit>): Promise<UserLimit> {
    try {
      const { userLimitId, ...rest } = userLimit;
      return await this.prisma.userLimit.update({
        where: { userLimitId: userLimit.userLimitId },
        data: rest,
      });
    } catch (error) {
      throw new AppError(
        '[database] user-limit-update-repository-error',
        `Failed to update user limit: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // Delete a user limit by ID
  async delete(userLimitId: string): Promise<UserLimit> {
    try {
      return await this.prisma.userLimit.delete({
        where: { userLimitId },
      });
    } catch (error) {
      throw new AppError(
        '[database] user-limit-delete-by-id-repository-error',
        `Failed to delete user limit ${userLimitId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        404
      );
    }
  }

  // Find all user limits
  async findAll(): Promise<UserLimit[]> {
    try {
      return await this.prisma.userLimit.findMany();
    } catch (error) {
      throw new AppError(
        '[database] user-limit-find-all-repository-error',
        `Failed to fetch all user limits: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        404,
        false
      );
    }
  }

  // Find a user limit by ID
  async findById(userLimitId: string): Promise<UserLimit | null> {
    try {
      return this.prisma.userLimit.findUnique({
        where: { userLimitId },
      });
    } catch (error) {
      throw new AppError(
        '[database] user-limit-find-by-id-repository-error',
        `Failed to find user limit ${userLimitId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        404
      );
    }
  }

  // Find user limits by user ID
  async findByUserId(userId: string): Promise<UserLimit[]> {
    try {
      return await this.prisma.userLimit.findMany({
        where: { userId },
      });
    } catch (error) {
      throw new AppError(
        '[database] user-limit-find-by-user-id-repository-error',
        `Failed to find user limits for user ${userId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        404,
        false
      );
    }
  }

  // Cleanup method for Prisma connection
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
