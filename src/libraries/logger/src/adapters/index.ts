import { Logger, LoggerConfiguration } from '../types';
import PinoLogger from './pino.adapter';

// Logger wrapper for the application
// This is a wrapper around the PinoLogger or any other logger that implements the Logger interface
// It provides a more user-friendly interface for the application

class LoggerWrapper implements Logger {
  #underlyingLogger: Logger | undefined;

  #getInitializeLogger(): Logger {
    this.configureLogger({}, false);
    return this.#underlyingLogger!;
  }

  configureLogger(
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true
  ): void {
    if (this.#underlyingLogger == undefined || overrideIfExists === true) {
      this.#underlyingLogger = new PinoLogger(
        configuration.level ?? 'info',
        configuration.prettyPrint ?? true
      );
    }
  }

  resetLogger() {
    this.#underlyingLogger = undefined;
  }

  debug(message: string, metadata?: object): void {
    this.#getInitializeLogger().debug(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  error(message: string, metadata?: object): void {
    this.#getInitializeLogger().error(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  info(message: string, metadata?: object): void {
    this.#getInitializeLogger().info(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  warning(message: string, metadata?: object): void {
    this.#getInitializeLogger().warning(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  static #insertContextIntoMetadata(metadata?: object): object | undefined {
    if (metadata == null) {
      return {};
    }

    return { ...metadata };
  }

  private getLogger(): Logger | undefined {
    return this.#underlyingLogger;
  }
}

export const logger = new LoggerWrapper();
