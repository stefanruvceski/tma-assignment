import { Server } from 'http';
import { logger } from '@tma-monorepo/logger';
import { AddressInfo } from 'net';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from '@tma-monorepo/error-handling';
import defineUserLimitRoutes from './routes';
import ConfigProvider, { configKey } from '@tma-monorepo/config';

let connection: Server;
const config = new ConfigProvider('user-limit-service');

async function startWebServer(): Promise<AddressInfo> {
  logger.configureLogger(
    { prettyPrint: config.getValue(configKey.pretty_print) as boolean },
    true
  );

  const expressApp = express();
  defineCommonMiddlewares(expressApp);
  defineUserLimitRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);

  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

function defineCommonMiddlewares(expressApp: express.Application) {
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const portToListenTo = config.getValue(configKey.port);
    const webServerPort = portToListenTo || 0;
    logger.info(`Server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      error: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (error && typeof error === 'object') {
        if (
          error.isCatastrophic === undefined ||
          error.isCatastrophic === null
        ) {
          error.isCatastrophic = true;
        }
      }
      // ✅ Best Practice: Pass all error to a centralized error handler so they get treated equally
      errorHandler.handleError(error);
      res.status(error?.HTTPStatus || 500).json({
        message: error?.message || 'Internal Server Error',
      });
    }
  );
}

export { startWebServer, stopWebServer };
