import { logger } from '../config/logger';
import { Campaign } from '../models/campaign';
import { MessageQueueService } from './messageQueue';
import { SlackService } from './slackService';
import { AIMessage } from '../models/aiMessage';

export class CampaignService {
  private messageQueueService: MessageQueueService;
  private slackService: SlackService;

  constructor() {
    this.messageQueueService = new MessageQueueService();
    this.slackService = new SlackService();
  }

  // Create a new campaign
  async createCampaign(data: any): Promise<any> {
    try {
      const campaign = await Campaign.create(data);
      
      // Add initial recipients
      const members = await this.slackService.getChannelMembers(data.targetChannel);
      
      await Campaign.updateOne(
        { _id: campaign._id },
        { $push: { recipients: members.map(userId => ({ userId })) } }
      );

      return campaign;
    } catch (error) {
      logger.error('Failed to create campaign:', error);
      throw error;
    }
  }

  // Update campaign status
  async updateStatus(campaignId: string, status: string): Promise<void> {
    try {
      await Campaign.updateOne(
        { _id: campaignId },
        { status }
      );
    } catch (error) {
      logger.error('Failed to update campaign status:', error);
      throw error;
    }
  }

  // Send campaign messages
  async sendMessages(campaignId: string): Promise<void> {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const pendingRecipients = campaign.recipients.filter(
        r => r.status === 'pending'
      );

      for (const recipient of pendingRecipients) {
        // Generate personalized message
        const context = {
          metadata: {
            userId: recipient.userId,
            campaignId: campaignId,
            workspaceId: campaign.workspaceId
          },
          user: {
            id: recipient.userId
          }
        };

        // Add message to queue
        await this.messageQueueService.addMessage(
          campaign.workspaceId.toString(),
          campaign.targetChannel,
          campaign.messageTemplate,
          context
        );

        // Update recipient status
        await Campaign.updateOne(
          { _id: campaignId, 'recipients.userId': recipient.userId },
          { 'recipients.$.status': 'sent', 'recipients.$.lastSent': new Date() }
        );
      }
    } catch (error) {
      logger.error('Failed to send campaign messages:', error);
      throw error;
    }
  }

  // Track campaign performance
  async trackPerformance(campaignId: string): Promise<void> {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get conversation history
      const messages = await AIMessage.find({
        campaignId,
        workspaceId: campaign.workspaceId
      });

      // Calculate metrics
      const successfulReplies = messages.filter(
        m => m.role === 'user' && m.sentiment > 0
      ).length;

      const responseRate = successfulReplies / campaign.recipients.length;
      const conversionRate = campaign.recipients.filter(
        r => r.status === 'converted'
      ).length / campaign.recipients.length;

      // Update campaign metrics
      await Campaign.updateOne(
        { _id: campaignId },
        {
          $set: {
            'performance.totalMessages': messages.length,
            'performance.successfulReplies': successfulReplies,
            'performance.responseRate': responseRate,
            'performance.conversionRate': conversionRate
          }
        }
      );
    } catch (error) {
      logger.error('Failed to track campaign performance:', error);
      throw error;
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      const campaign = await Campaign.findById(campaignId).populate('workspaceId');
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const messages = await AIMessage.find({
        campaignId,
        workspaceId: campaign.workspaceId
      }).sort({ createdAt: -1 });

      return {
        campaign,
        messages,
        metrics: {
          totalMessages: messages.length,
          successfulReplies: messages.filter(m => m.role === 'user' && m.sentiment > 0).length,
          responseRate: campaign.performance.responseRate,
          conversionRate: campaign.performance.conversionRate
        }
      };
    } catch (error) {
      logger.error('Failed to get campaign analytics:', error);
      throw error;
    }
  }
}
