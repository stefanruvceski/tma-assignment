import { IUserLimitService } from '../../domain/user-limit-service.interface'; // Adjust path
import { UserLimit } from '@tma-monorepo/database';

// Payload types for each event
export interface CreateUserLimitPayload {
  payload: UserLimit;
}

export interface ChangeUserLimitProgressPayload {
  userId: string;
  amount: string;
  userLimitId: string;
}

export interface ResetUserLimitPayload {
  userId: string;
  userLimitId: string;
}

// Union type for all possible payloads
export type UserLimitEventPayload =
  | CreateUserLimitPayload
  | ChangeUserLimitProgressPayload
  | ResetUserLimitPayload;

export interface Command {
  execute(): Promise<void>;
}
// Abstract base class with payload
export abstract class BaseUserLimitCommand implements Command {
  #service: IUserLimitService;
  #payload: UserLimitEventPayload;

  constructor(service: IUserLimitService, payload: UserLimitEventPayload) {
    this.#service = service;
    this.#payload = payload;
  }

  protected get service(): IUserLimitService {
    return this.#service;
  }

  protected get payload(): UserLimitEventPayload {
    return this.#payload;
  }

  abstract execute(): Promise<void>;

  protected log(message: string): void {
    console.log(`${message}`);
  }
}
