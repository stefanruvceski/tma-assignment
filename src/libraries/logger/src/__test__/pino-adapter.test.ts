import { logger } from '../adapters';
import PinoLogger from '../adapters/pino.adapter';

jest.mock('../adapters/pino.adapter', () => {
  return jest.fn().mockImplementation((level, prettyPrint) => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    level,
    prettyPrint,
  }));
});

describe('LoggerWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('configureLogger', () => {
    it('should initialize the underlying logger with default values', () => {
      logger.configureLogger({});
      const underlyingLogger = logger;

      expect(PinoLogger).toHaveBeenCalledWith('info', true);
      expect(underlyingLogger).toBeDefined();
    });

    it('should initialize the underlying logger with custom configuration', () => {
      logger.configureLogger({ level: 'debug', prettyPrint: false }, true);
      const underlyingLogger = logger;

      expect(PinoLogger).toHaveBeenCalledWith('debug', false);
      expect(underlyingLogger).toBeDefined();
    });

    it('should not override existing logger if overrideIfExists is false', () => {
      logger.configureLogger({ level: 'info' });
      const firstLogger = logger;

      logger.configureLogger({ level: 'debug' }, false);
      const secondLogger = logger;

      expect(PinoLogger).toHaveBeenCalledTimes(1);
      expect(firstLogger).toBe(secondLogger);
    });
  });

  describe('logging methods', () => {
    let mockPinoLogger: any;

    beforeEach(() => {
      logger.configureLogger({});
      mockPinoLogger = (logger as any).getLogger();
    });

    describe('debug', () => {
      it('should call debug on underlying logger with message and empty metadata', () => {
        logger.debug('Debug message');
        expect(mockPinoLogger.debug).toHaveBeenCalledWith('Debug message', {});
      });

      it('should call debug with message and provided metadata', () => {
        const metadata = { key: 'value' };
        logger.debug('Debug message', metadata);
        expect(mockPinoLogger.debug).toHaveBeenCalledWith('Debug message', {
          key: 'value',
        });
      });
    });

    describe('error', () => {
      it('should call error on underlying logger with message and empty metadata', () => {
        logger.error('Error message');
        expect(mockPinoLogger.error).toHaveBeenCalledWith('Error message', {});
      });

      it('should call error with message and provided metadata', () => {
        const metadata = { error: 'details' };
        logger.error('Error message', metadata);
        expect(mockPinoLogger.error).toHaveBeenCalledWith('Error message', {
          error: 'details',
        });
      });
    });

    describe('info', () => {
      it('should call info on underlying logger with message and empty metadata', () => {
        logger.info('Info message');
        expect(mockPinoLogger.info).toHaveBeenCalledWith('Info message', {});
      });

      it('should call info with message and provided metadata', () => {
        const metadata = { source: 'app' };
        logger.info('Info message', metadata);
        expect(mockPinoLogger.info).toHaveBeenCalledWith('Info message', {
          source: 'app',
        });
      });
    });

    describe('warning', () => {
      it('should call warning on underlying logger with message and empty metadata', () => {
        logger.warning('Warning message');
        expect(mockPinoLogger.warning).toHaveBeenCalledWith(
          'Warning message',
          {}
        );
      });

      it('should call warning with message and provided metadata', () => {
        const metadata = { warn: 'caution' };
        logger.warning('Warning message', metadata);
        expect(mockPinoLogger.warning).toHaveBeenCalledWith('Warning message', {
          warn: 'caution',
        });
      });
    });
  });
});
