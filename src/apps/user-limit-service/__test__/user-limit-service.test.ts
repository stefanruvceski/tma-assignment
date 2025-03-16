import {
  LimitPeriod,
  LimitStatus,
  LimitType,
  UserLimit,
  UserLimitRepository,
} from '@tma-monorepo/database';
import { IUserLimitService } from '../domain/user-limit-service.interface';
import { createUserLimitService } from '../domain/user-limit.service';
import { assertUserExists } from '../domain/user-service-client';
import { AppError } from '@tma-monorepo/error-handling';

const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
const mockUserLimit: UserLimit = {
  userLimitId: '123',
  userId: 'user-456',
  status: LimitStatus.ACTIVE,
  activeFrom: BigInt(tomorrow.getTime()),
  nextResetTime: BigInt(tomorrow.getTime()),
  createdAt: BigInt(tomorrow.getTime()),
  activeUntil: BigInt(tomorrow.getTime()),
  period: LimitPeriod.CALENDAR_DAY,
  value: '1000',
  currencyCode: 'USD',
  brandId: 'brand-123',
  previousLimitValue: '0',
  progress: '0',
  type: LimitType.BALANCE,
};

jest.mock('../domain/user-limit.validators', () => ({
  assertNewUserLimitIsValid: jest.fn(),
}));

jest.mock('../domain/user-service-client', () => ({
  assertUserExists: jest.fn(),
}));

describe('UserLimitService', () => {
  let service: IUserLimitService;
  let repository: UserLimitRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserLimitRepository>;

    service = createUserLimitService(repository);
  });

  function serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  }

  it('should add a new user limit', async () => {
    (assertUserExists as jest.Mock).mockResolvedValue({
      id: 'user-456',
      status: 'active',
    });
    (repository.create as jest.Mock).mockResolvedValueOnce(mockUserLimit);

    const result = await service.addUserLimit(mockUserLimit);
    expect(serializeBigInt(result)).toEqual(serializeBigInt(mockUserLimit));
  });

  it('should throw error if user does not exist', async () => {
    (assertUserExists as jest.Mock).mockRejectedValueOnce(
      new AppError('user-not-found', 'User not found', 404, true)
    );

    await expect(service.addUserLimit(mockUserLimit)).rejects.toThrow(
      'User not found'
    );
  });

  it('should update user limit', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(mockUserLimit);
    (repository.update as jest.Mock).mockResolvedValue({
      ...mockUserLimit,
      value: '2000',
    });

    const result = await service.updateUserLimit('123', {
      ...mockUserLimit,
      value: '2000',
    });
    expect(serializeBigInt(result).value).toEqual('2000');
  });

  it('should delete a user limit', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(mockUserLimit);
    (repository.delete as jest.Mock).mockResolvedValue(mockUserLimit);

    const result = await service.deleteUserLimit('123');
    expect(serializeBigInt(result)).toEqual(serializeBigInt(mockUserLimit));
  });

  it('should get a user limit by ID', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(mockUserLimit);

    const result = await service.getUserLimit('123');
    expect(serializeBigInt(result)).toEqual(serializeBigInt(mockUserLimit));
  });

  it('should return all user limits for a user', async () => {
    (repository.findByUserId as jest.Mock).mockResolvedValue([mockUserLimit]);
    (assertUserExists as jest.Mock).mockResolvedValue({
      id: 'user-456',
      status: 'active',
    });

    const result = await service.getUserLimitsByUserId('user-456');
    expect(serializeBigInt(result)).toEqual([serializeBigInt(mockUserLimit)]);
  });
});
