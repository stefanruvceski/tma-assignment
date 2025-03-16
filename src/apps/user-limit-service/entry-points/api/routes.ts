import { Router, Application } from 'express';
import { logger } from '@tma-monorepo/logger';
import { createUserLimitService } from '../../domain/user-limit.service';
import { IUserLimitService } from '../../domain/user-limit-service.interface';

export default function defineUserLimitRoutes(expressApp: Application): void {
  const router = Router();
  const userLimitService: IUserLimitService = createUserLimitService();

  // Get all user limits
  router.get('/', async (req, res, next) => {
    try {
      logger.info('User Limit API was called to get all user limits');
      const limits = await userLimitService.getAllUserLimits();
      logger.info('[SERVICE]Getting all user limits222222');

      res.json(
        JSON.parse(
          JSON.stringify(limits, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
          )
        )
      );
    } catch (error) {
      next(error);
    }
  });

  // Get user limit by ID
  router.get('/:userLimitId', async (req, res, next) => {
    try {
      const { userLimitId } = req.params;
      logger.info(
        `User Limit API was called to get user limit by ID ${userLimitId}`
      );

      const limit = await userLimitService.getUserLimit(userLimitId);
      if (!limit) {
        res.status(404).end();
        return;
      }

      res.json(
        JSON.parse(
          JSON.stringify(limit, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
          )
        )
      );
    } catch (error) {
      next(error);
    }
  });

  // Get user limits by user ID
  router.get('/user/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      logger.info(
        `User Limit API was called to get user limits for user ${userId}`
      );

      const limits = await userLimitService.getUserLimitsByUserId(userId);
      if (!limits.length) {
        res.status(404).json({ message: 'No limits found for this user' });
        return;
      }

      res.json(
        JSON.parse(
          JSON.stringify(limits, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
          )
        )
      );
    } catch (error) {
      next(error);
    }
  });

  // Mount the router on the app
  expressApp.use('/user-limit', router);
}
