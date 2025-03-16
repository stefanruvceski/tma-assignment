import { logger } from '@tma-monorepo/logger';
import { IUserLimitService } from '../../domain/user-limit-service.interface';
import {
  BaseUserLimitCommand,
  ResetUserLimitPayload,
} from './user-limit.command';
// Command for USER_LIMIT_RESET
export class ResetUserLimitCommand extends BaseUserLimitCommand {
  constructor(service: IUserLimitService, payload: ResetUserLimitPayload) {
    super(service, payload);
  }

  async execute(): Promise<void> {
    const payload = this.payload as ResetUserLimitPayload;
    await this.service.updateUserLimit(payload.userLimitId, {
      userId: payload.userId,
      progress: '0',
      userLimitId: payload.userLimitId,
    });
    logger.info(`User limit ${payload.userLimitId} progress reset`);
  }
}
