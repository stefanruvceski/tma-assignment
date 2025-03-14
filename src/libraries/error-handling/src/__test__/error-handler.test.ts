import * as Http from 'http';
import { errorHandler, covertUnknownToAppError } from '../error-handler';
import { logger } from '@tma-monorepo/logger';
import { AppError } from '../app-error';

jest.mock('@tma-monorepo/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../app-error', () => {
  return {
    AppError: jest
      .fn()
      .mockImplementation((name, message, HTTPStatus, isCatastrophic) => ({
        name,
        message,
        HTTPStatus,
        isCatastrophic,
        stack: undefined,
      })),
  };
});

const mockHttpServer = {
  close: jest.fn((cb) => cb && cb()),
} as unknown as Http.Server;

const mockProcessOn = jest
  .spyOn(process, 'on')
  .mockImplementation(() => process);
const mockProcessExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);
const mockProcessStdoutWrite = jest
  .spyOn(process.stdout, 'write')
  .mockImplementation(() => true);

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listenToErrorEvents', () => {
    it('should register uncaughtException handler', () => {
      errorHandler.listenToErrorEvents(mockHttpServer);
      expect(mockProcessOn).toHaveBeenCalledWith(
        'uncaughtException',
        expect.any(Function)
      );
    });

    it('should register unhandledRejection handler', () => {
      errorHandler.listenToErrorEvents(mockHttpServer);
      expect(mockProcessOn).toHaveBeenCalledWith(
        'unhandledRejection',
        expect.any(Function)
      );
    });

    it('should register SIGTERM handler and call terminateHttpServerAndExit', async () => {
      errorHandler.listenToErrorEvents(mockHttpServer);
      const sigtermHandler = mockProcessOn.mock.calls.find(
        (call) => call[0] === 'SIGTERM'
      )?.[1];
      if (sigtermHandler) {
        await sigtermHandler();
      }
      expect(logger.error).toHaveBeenCalledWith(
        'App received SIGTERM event, try to gracefully close the server'
      );
      expect(mockHttpServer.close).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalled();
    });

    it('should register SIGINT handler and call terminateHttpServerAndExit', async () => {
      errorHandler.listenToErrorEvents(mockHttpServer);
      const sigintHandler = mockProcessOn.mock.calls.find(
        (call) => call[0] === 'SIGINT'
      )?.[1];
      if (sigintHandler) {
        await sigintHandler();
      }
      expect(logger.error).toHaveBeenCalledWith(
        'App received SIGINT event, try to gracefully close the server'
      );
      expect(mockHttpServer.close).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalled();
    });
  });

  describe('handleError', () => {
    it('should handle a known AppError and return HTTP status', () => {
      const appError = new AppError('TestError', 'Test message', 400, false);
      const status = errorHandler.handleError(appError);

      expect(logger.info).toHaveBeenCalledWith('Handling error');
      expect(logger.error).toHaveBeenCalledWith('Test message', appError);
      expect(status).toBe(400);
      expect(mockProcessExit).not.toHaveBeenCalled();
    });
  });

  describe('covertUnknownToAppError', () => {
    it('should return AppError if input is already AppError', () => {
      const appError = new AppError('TestError', 'Test message', 400, false);
      const result = covertUnknownToAppError(appError);

      expect(result).toEqual(appError);
    });

    it('should convert a standard Error to AppError', () => {
      const error = new Error('Standard error');
      error.stack = 'some stack trace';
      const result = covertUnknownToAppError(error);

      expect(AppError).toHaveBeenCalledWith(
        'Error',
        'Standard error',
        500,
        true
      );
      expect(result.stack).toBe('some stack trace');
    });

    it('should convert an object with custom properties to AppError', () => {
      const customError = {
        reason: 'Oops',
        code: 'CUSTOM_ERR',
        status: 404,
        catastrophic: false,
      };
      const result = covertUnknownToAppError(customError);

      expect(AppError).toHaveBeenCalledWith('CUSTOM_ERR', 'Oops', 404, false);
      expect(result).toMatchObject(customError);
    });

    it('should convert a non-object to AppError with defaults', () => {
      const result = covertUnknownToAppError('string error');

      expect(AppError).toHaveBeenCalledWith(
        'unknown-error',
        'Unknown error',
        500,
        true
      );
      expect(result.stack).toBeUndefined();
    });
  });
});
