import { AppError } from '@tma-monorepo/error-handling';
import { assertNewUserLimitIsValid } from './user-limit.validators';
import { assertUserExists } from './user-service-client';
import {
  LimitStatus,
  UserLimit,
  UserLimitRepository,
} from '@tma-monorepo/database';
import { IUserLimitService } from './user-limit-service.interface';
import { logger } from '@tma-monorepo/logger';

class UserLimitService implements IUserLimitService {
  #repository: UserLimitRepository;

  // Dependency Injection via constructor
  constructor(repository: UserLimitRepository) {
    this.#repository = repository;
  }

  // Add a new user limit
  async addUserLimit(newUserLimit: UserLimit): Promise<UserLimit> {
    // Validate input
    assertNewUserLimitIsValid(newUserLimit);

    // Check user existence (business rule)
    const user = await this.#assertUserExists(newUserLimit.userId);

    // Prepare the final user limit with business logic
    const finalUserLimit: UserLimit = { ...newUserLimit };

    // Persist to repository
    return await this.#repository.create(
      this.#applyBusinessRules(finalUserLimit, user)
    );
  }

  async updateUserLimit(
    userLimitId: string,
    userLimit: Partial<UserLimit>
  ): Promise<UserLimit> {
    if (!userLimit.userId) {
      throw new AppError(
        '[user-limit-service] user-not-found',
        `User with ID ${userLimit.userId} does not exist.`,
        404,
        true
      );
    }
    const existingLimit = await this.#repository.findById(userLimitId);
    if (!existingLimit) {
      throw new AppError(
        '[user-limit-service] user-limit-not-found',
        `User limit with ID ${userLimitId} not found`,
        404,
        true
      );
    }

    return await this.#repository.update(userLimit);
  }

  // Delete a user limit by ID
  async deleteUserLimit(userLimitId: string): Promise<UserLimit> {
    const existingLimit = await this.#repository.findById(userLimitId);
    if (!existingLimit) {
      throw new AppError(
        '[user-limit-service] user-limit-not-found',
        `User limit with ID ${userLimitId} not found`,
        404,
        true
      );
    }

    return await this.#repository.delete(userLimitId);
  }

  // Get a user limit by ID
  async getUserLimit(userLimitId: string): Promise<UserLimit | null> {
    const limit = await this.#repository.findById(userLimitId);
    if (!limit) {
      throw new AppError(
        '[user-limit-service] user-limit-not-found',
        `User limit with ID ${userLimitId} not found`,
        404,
        true
      );
    }
    return limit;
  }

  // Get all user limits for a user
  async getUserLimitsByUserId(userId: string): Promise<UserLimit[]> {
    await this.#assertUserExists(userId);
    return await this.#repository.findByUserId(userId);
  }

  // Get all user limits
  async getAllUserLimits(): Promise<UserLimit[]> {
    logger.info('[SERVICE]Getting all user limits');
    return await this.#repository.findAll();
  }

  // Private helper to check user existence
  async #assertUserExists(userId: string): Promise<{
    id: string;
    status: string;
  }> {
    const user = await assertUserExists(userId);
    if (!user) {
      throw new AppError(
        '[user-limit-service] user-not-found',
        `User with ID ${userId} does not exist`,
        404,
        true
      );
    }
    return user;
  }
  // Private method for business rules
  #applyBusinessRules(
    userLimit: UserLimit,
    user: { id: string; status: string }
  ): UserLimit {
    // Example rule: If user isn’t active, set limit to FUTURE
    if (user.status !== 'active') {
      userLimit.status = LimitStatus.FUTURE;
    }

    // Example rule: Ensure activeFrom is not in the past
    const now = Date.now();
    if (userLimit.activeFrom < now) {
      userLimit.activeFrom = now as unknown as bigint; // Adjust to current time
    }
    return userLimit;
  }
}

export const createUserLimitService = (
  repository?: UserLimitRepository
): IUserLimitService => {
  return new UserLimitService(repository ?? new UserLimitRepository());
};
