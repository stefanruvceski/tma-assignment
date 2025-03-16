import { logger } from '@tma-monorepo/logger';
import { IUserLimitService } from '../../domain/user-limit-service.interface';
import {
  BaseUserLimitCommand,
  ChangeUserLimitProgressPayload,
} from './user-limit.command';

// Command for USER_LIMIT_PROGRESS_CHANGED
export class ChangeUserLimitProgressCommand extends BaseUserLimitCommand {
  constructor(
    service: IUserLimitService,
    payload: ChangeUserLimitProgressPayload
  ) {
    super(service, payload);
  }

  async execute(): Promise<void> {
    const payload = this.payload as ChangeUserLimitProgressPayload; // Direct access
    await this.service.updateUserLimit(
      (this.payload as ChangeUserLimitProgressPayload).userLimitId,
      {
        progress: payload.amount,
        userId: payload.userId,
        userLimitId: payload.userLimitId,
      }
    );
    logger.info(
      `User limit progress ${payload.userLimitId} changed to ${payload.amount}`
    );
  }
}
