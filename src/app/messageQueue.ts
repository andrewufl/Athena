import { logger } from '../config/logger';
import { MessageQueueService } from '../services/messageQueue';

export const setupMessageQueue = () => {
  const messageQueue = new MessageQueueService();
  logger.info('Message queue initialized');
  return messageQueue;
};
