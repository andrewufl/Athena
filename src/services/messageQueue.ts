import Queue from 'bull';
import { logger } from '../config/logger';
import { AIMessage } from '../models/aiMessage';
import { SlackService } from './slackService';
import { AIService } from './aiService';

// Create message queue
const messageQueue = new Queue('message-queue', process.env.REDIS_URL || 'redis://localhost:6379');

// Retry strategy for failed jobs
messageQueue.on('failed', async (job, error) => {
  logger.error(`Job ${job.id} failed:`, error);
  
  // Log failed message
  await AIMessage.create({
    workspaceId: job.data.workspaceId,
    userId: job.data.userId,
    campaignId: job.data.campaignId,
    channelId: job.data.channelId,
    content: job.data.message,
    role: 'assistant',
    sentiment: 0,
    metadata: {
      error: error.message
    }
  });
});

// Process messages
messageQueue.process(async (job) => {
  const { workspaceId, channelId, message, context } = job.data;
  
  try {
    // Generate AI response
    const aiService = new AIService();
    const response = await aiService.generateMessage('follow-up', context);
    
    // Send message to Slack
    const slackService = new SlackService();
    await slackService.sendMessage(channelId, response);
    
    // Save message to database
    await AIMessage.create({
      workspaceId,
      userId: context.metadata.userId,
      campaignId: context.metadata.campaignId,
      channelId,
      content: response,
      role: 'assistant',
      sentiment: await aiService.analyzeSentiment(response),
      metadata: {
        templateId: 'follow-up',
        context: {
          user: context.metadata.user,
          product: context.metadata.product
        }
      }
    });

    return { success: true, messageId: job.id };
  } catch (error) {
    logger.error(`Failed to process job ${job.id}:`, error);
    throw error;
  }
});

export class MessageQueueService {
  // Add message to queue
  async addMessage(
    workspaceId: string,
    channelId: string,
    message: string,
    context: any
  ): Promise<void> {
    try {
      await messageQueue.add({
        workspaceId,
        channelId,
        message,
        context
      });
    } catch (error) {
      logger.error('Failed to add message to queue:', error);
      throw error;
    }
  }

  // Get queue status
  async getStatus(): Promise<any> {
    try {
      return await messageQueue.getJobCounts();
    } catch (error) {
      logger.error('Failed to get queue status:', error);
      throw error;
    }
  }

  // Clear queue
  async clear(): Promise<void> {
    try {
      await messageQueue.empty();
    } catch (error) {
      logger.error('Failed to clear queue:', error);
      throw error;
    }
  }
}
