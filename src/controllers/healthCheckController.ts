import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export class HealthCheckController {
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(500).json({ status: 'unhealthy', error: 'Health check failed' });
    }
  }
}

export const healthCheckController = new HealthCheckController();
