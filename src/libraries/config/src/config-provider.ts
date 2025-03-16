import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { resolve } from 'path';
import { EnvType, Config } from './types/config-types';

// Config provider for services
export default class ConfigProvider {
  #env: EnvType;
  #config: Config;
  constructor(serviceName?: string) {
    this.#env = this.#loadEnv(serviceName);
    this.#config = this.#getConfig();
  }

  // Load environment variables and override with service specific variables
  #loadEnv(serviceName?: string): EnvType {
    const rootEnv = dotenv.config({
      path: resolve(process.cwd(), '../../../.env'),
    });
    dotenvExpand.expand(rootEnv);
    if (!serviceName) {
      return { ...process.env, SERVICE_NAME: '' };
    }
    const serviceEnv = dotenv.config({
      path: resolve(process.cwd(), '.env'),
      override: true,
    });
    dotenvExpand.expand(serviceEnv);

    return {
      ...process.env,
      SERVICE_NAME: serviceName,
    };
  }

  #getConfig(): Config {
    return {
      port: parseInt(
        this.#env[`${this.#env.SERVICE_NAME.toUpperCase()}_PORT`] || '5001',
        10
      ),
      test_env: this.#env.TEST_ENV || '',
      service_name: this.#env.SERVICE_NAME || '',
      db_connection_string: this.#env.DB_CONNECTION_STRING || '',
      event_stream_endpoint: this.#env.EVENT_STREAM_ENDPOINT || '',
      aws_access_key_id: this.#env.AWS_ACCESS_KEY_ID || '',
      aws_secret_access_key: this.#env.AWS_SECRET_ACCESS_KEY || '',
      aws_region: this.#env.AWS_REGION || '',
      aws_stream_name: this.#env.AWS_STREAM_NAME || '',
      pretty_print: this.#env.PRETTY_PRINT === 'true' || false,
    };
  }

  getValue<T extends keyof Config>(key: T): Config[T] {
    return this.#config[key];
  }
}
