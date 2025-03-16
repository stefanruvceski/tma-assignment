import { UserLimit } from '@tma-monorepo/database';

export interface IUserLimitService {
  addUserLimit(newUserLimit: UserLimit): Promise<UserLimit>;
  deleteUserLimit(userLimitId: string): Promise<UserLimit>;
  getUserLimit(userLimitId: string): Promise<UserLimit | null>;
  getUserLimitsByUserId(userId: string): Promise<UserLimit[]>;
  getAllUserLimits(): Promise<UserLimit[]>;
  updateUserLimit(
    userLimitId: string,
    userLimit: Partial<UserLimit>
  ): Promise<UserLimit>;
}

export const USER_LIMIT_CREATED = 'USER_LIMIT_CREATED';
export const USER_LIMIT_PROGRESS_CHANGED = 'USER_LIMIT_PROGRESS_CHANGED';
export const USER_LIMIT_RESET = 'USER_LIMIT_RESET';
