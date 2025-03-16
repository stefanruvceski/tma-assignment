import {
  ChangeUserLimitProgressPayload,
  CreateUserLimitPayload,
  ResetUserLimitPayload,
} from './user-limit.command';
import {
  IUserLimitService,
  USER_LIMIT_CREATED,
  USER_LIMIT_PROGRESS_CHANGED,
  USER_LIMIT_RESET,
} from '../../domain/user-limit-service.interface';
import { CreateUserLimitCommand } from './create-user-limit.command';
import { UserLimitEventPayload } from './user-limit.command';
import { Command } from './user-limit.command';
import { ChangeUserLimitProgressCommand } from './change-progress.command';
import { ResetUserLimitCommand } from './reset-progress.command';
import { logger } from '@tma-monorepo/logger';
import { AppError } from '@tma-monorepo/error-handling';

// Command Executor (Invoker)
export class UserLimitCommandExecutor {
  #service: IUserLimitService; // Executor keeps # for true privacy

  constructor(service: IUserLimitService) {
    this.#service = service;
  }

  async executeCommand(event: {
    eventType: string;
    data: UserLimitEventPayload;
  }): Promise<void> {
    let command: Command;

    switch (event.eventType) {
      case USER_LIMIT_CREATED:
        command = new CreateUserLimitCommand(
          this.#service,
          event.data as CreateUserLimitPayload
        );
        break;
      case USER_LIMIT_PROGRESS_CHANGED:
        command = new ChangeUserLimitProgressCommand(
          this.#service,
          event.data as ChangeUserLimitProgressPayload
        );
        break;
      case USER_LIMIT_RESET:
        command = new ResetUserLimitCommand(
          this.#service,
          event.data as ResetUserLimitPayload
        );
        break;
      default:
        throw new AppError(
          `[user-limit-service] unknown-event-type:`,
          `Unknown event type ${event.eventType}`
        );
    }

    await command.execute();
  }
}
