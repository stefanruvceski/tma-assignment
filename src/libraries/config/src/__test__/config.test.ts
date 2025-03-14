import ConfigProvider from '../config-provider';
import { configKey } from '../types/config-types';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { resolve } from 'path';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));
jest.mock('dotenv-expand', () => ({
  expand: jest.fn(),
}));
jest.mock('path', () => ({
  resolve: jest.fn(),
}));

describe('ConfigProvider', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.clearAllMocks();
    process.env = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor and #loadEnv', () => {
    it('loads root .env and sets empty SERVICE_NAME when no serviceName provided', () => {
      (dotenv.config as jest.Mock).mockReturnValueOnce({
        parsed: { ROOT_VAR: 'root-value' },
      });
      (resolve as jest.Mock).mockReturnValueOnce('/root/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation((config) => {
        Object.assign(process.env, config.parsed);
      });

      const configProvider = new ConfigProvider();

      expect(dotenv.config).toHaveBeenCalledWith({ path: '/root/.env' });
      expect(dotenv.config).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith(process.cwd(), '../../../.env');
      expect(configProvider.getValue(configKey.service_name)).toBe('');
      expect(configProvider.getValue(configKey.test_env)).toBe('');
    });

    it('loads root and service .env files with SERVICE_NAME when serviceName provided', () => {
      const serviceName = 'test_service';
      (dotenv.config as jest.Mock)
        .mockReturnValueOnce({ parsed: { ROOT_VAR: 'root-value' } })
        .mockReturnValueOnce({ parsed: { SERVICE_VAR: 'service-value' } });
      (resolve as jest.Mock)
        .mockReturnValueOnce('/root/.env')
        .mockReturnValueOnce('/service/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation((config) => {
        Object.assign(process.env, config.parsed);
      });

      const configProvider = new ConfigProvider(serviceName);

      expect(dotenv.config).toHaveBeenCalledWith({ path: '/root/.env' });
      expect(dotenv.config).toHaveBeenCalledWith({
        path: '/service/.env',
        override: true,
      });
      expect(resolve).toHaveBeenCalledWith(process.cwd(), '../../../.env');
      expect(resolve).toHaveBeenCalledWith(process.cwd(), '.env');
      expect(dotenvExpand.expand).toHaveBeenCalledTimes(2);
      expect(configProvider.getValue(configKey.service_name)).toBe(serviceName);
    });

    it('overrides root env with service env when variables conflict', () => {
      const serviceName = 'test_service';
      (dotenv.config as jest.Mock)
        .mockReturnValueOnce({ parsed: { CONFLICT_VAR: 'root-value' } })
        .mockReturnValueOnce({ parsed: { CONFLICT_VAR: 'service-value' } });
      (resolve as jest.Mock)
        .mockReturnValueOnce('/root/.env')
        .mockReturnValueOnce('/service/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation((config) => {
        Object.assign(process.env, config.parsed);
      });

      const configProvider = new ConfigProvider(serviceName);

      expect(process.env.CONFLICT_VAR).toBe('service-value');
      expect(configProvider.getValue(configKey.service_name)).toBe(serviceName);
    });
  });

  describe('#getConfig and getValue', () => {
    it('returns config with values from env via getValue', () => {
      const serviceName = 'test_service';
      (dotenv.config as jest.Mock)
        .mockReturnValueOnce({
          parsed: { DB_CONNECTION_STRING: 'mongo://test' },
        })
        .mockReturnValueOnce({
          parsed: {
            TEST_SERVICE_PORT: '8080',
            TEST_ENV: 'test',
            EVENT_STREAM_ENDPOINT: 'http://stream',
          },
        });
      (resolve as jest.Mock)
        .mockReturnValueOnce('/root/.env')
        .mockReturnValueOnce('/service/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation((config) => {
        Object.assign(process.env, config.parsed);
      });

      const configProvider = new ConfigProvider(serviceName);

      expect(configProvider.getValue(configKey.port)).toBe(8080);
      expect(configProvider.getValue(configKey.test_env)).toBe('test');
      expect(configProvider.getValue(configKey.service_name)).toBe(serviceName);
      expect(configProvider.getValue(configKey.db_connection_string)).toBe(
        'mongo://test'
      );
      expect(configProvider.getValue(configKey.event_stream_endpoint)).toBe(
        'http://stream'
      );
    });

    it('uses defaults when env variables are missing', () => {
      const serviceName = 'test_service';
      (dotenv.config as jest.Mock)
        .mockReturnValueOnce({ parsed: undefined })
        .mockReturnValueOnce({ parsed: undefined });
      (resolve as jest.Mock)
        .mockReturnValueOnce('/root/.env')
        .mockReturnValueOnce('/service/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation(() => {});

      const configProvider = new ConfigProvider(serviceName);

      expect(configProvider.getValue(configKey.port)).toBe(5001);
      expect(configProvider.getValue(configKey.test_env)).toBe('');
      expect(configProvider.getValue(configKey.service_name)).toBe(serviceName);
      expect(configProvider.getValue(configKey.db_connection_string)).toBe('');
      expect(configProvider.getValue(configKey.event_stream_endpoint)).toBe('');
    });

    it('parses port correctly with fallback to default', () => {
      const serviceName = 'test_service';
      (dotenv.config as jest.Mock)
        .mockReturnValueOnce({ parsed: undefined })
        .mockReturnValueOnce({
          parsed: { TE_PORT: 'invalid' },
        });
      (resolve as jest.Mock)
        .mockReturnValueOnce('/root/.env')
        .mockReturnValueOnce('/service/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation((config) => {
        Object.assign(process.env, config.parsed);
      });

      const configProvider = new ConfigProvider(serviceName);

      expect(configProvider.getValue(configKey.port)).toBe(5001);
    });

    it('prioritizes service-specific port variable', () => {
      const serviceName = 'test_service';
      (dotenv.config as jest.Mock)
        .mockReturnValueOnce({ parsed: { TEST_SERVICE_PORT: '3000' } })
        .mockReturnValueOnce({ parsed: { TEST_SERVICE_PORT: '4000' } });
      (resolve as jest.Mock)
        .mockReturnValueOnce('/root/.env')
        .mockReturnValueOnce('/service/.env');
      (dotenvExpand.expand as jest.Mock).mockImplementation((config) => {
        Object.assign(process.env, config.parsed);
      });

      const configProvider = new ConfigProvider(serviceName);

      expect(configProvider.getValue(configKey.port)).toBe(4000);
    });
  });
});
