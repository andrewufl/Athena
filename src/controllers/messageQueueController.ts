import { Request, Response } from 'express';
import { MessageQueueService } from '../services/messageQueue';
import { logger } from '../config/logger';

export class MessageQueueController {
  private messageQueueService: MessageQueueService;

  constructor() {
    this.messageQueueService = new MessageQueueService();
  }

  // Add message to queue
  async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId, channelId, message, context } = req.body;
      
      if (!workspaceId || !channelId || !message || !context) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
      }

      await this.messageQueueService.addMessage(
        workspaceId,
        channelId,
        message,
        context
      );

      res.json({ status: 'success', message: 'Message added to queue' });
    } catch (error) {
      logger.error('Failed to add message to queue:', error);
      res.status(500).json({ error: 'Failed to add message to queue' });
    }
  }

  // Get queue status
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await this.messageQueueService.getStatus();
      res.json(status);
    } catch (error) {
      logger.error('Failed to get queue status:', error);
      res.status(500).json({ error: 'Failed to get queue status' });
    }
  }

  // Clear queue
  async clearQueue(req: Request, res: Response): Promise<void> {
    try {
      await this.messageQueueService.clear();
      res.json({ status: 'success', message: 'Queue cleared' });
    } catch (error) {
      logger.error('Failed to clear queue:', error);
      res.status(500).json({ error: 'Failed to clear queue' });
    }
  }
}
