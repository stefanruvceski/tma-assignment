import { UserLimit } from '@tma-monorepo/database';
import { IUserLimitService } from '../../domain/user-limit-service.interface';
import {
  BaseUserLimitCommand,
  CreateUserLimitPayload,
} from './user-limit.command';

// Command for USER_LIMIT_CREATED
export class CreateUserLimitCommand extends BaseUserLimitCommand {
  constructor(service: IUserLimitService, payload: CreateUserLimitPayload) {
    super(service, payload);
  }

  async execute(): Promise<void> {
    await this.service.addUserLimit(this.payload as UserLimit);
  }
}
