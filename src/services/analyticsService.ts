import { Campaign } from '../models/campaign';
import { Workspace } from '../models/workspace';
import { AIMessage } from '../models/aiMessage';
import { logger } from '../config/logger';

interface CampaignAnalytics {
  _id: string;
  name: string;
  totalMessages: number;
  replyRate: number;
  positiveSentiment: number;
  negativeSentiment: number;
  conversionRate: number;
}

export class AnalyticsService {
  async getCampaignAnalytics(): Promise<CampaignAnalytics[]> {
    try {
      const campaigns = await Campaign.find().populate('workspaceId');
      const analytics: CampaignAnalytics[] = [];

      for (const campaign of campaigns) {
        const messages = await AIMessage.find({ campaignId: campaign._id });
        const totalMessages = messages.length;
        const replies = messages.filter(m => m.role === 'assistant').length;
        const conversions = messages.filter(m => m.metadata?.converted).length;

        const replyRate = totalMessages > 0 ? (replies / totalMessages) * 100 : 0;
        const conversionRate = totalMessages > 0 ? (conversions / totalMessages) * 100 : 0;

        const sentiment = await this.calculateSentiment(messages);

        analytics.push({
          _id: campaign._id,
          name: campaign.name,
          totalMessages,
          replyRate,
          positiveSentiment: sentiment.positive,
          negativeSentiment: sentiment.negative,
          conversionRate
        });
      }

      return analytics;
    } catch (error) {
      logger.error('Error getting campaign analytics:', error);
      throw error;
    }
  }

  async getSentimentAnalysis(campaignId: string): Promise<any> {
    try {
      const messages = await AIMessage.find({ campaignId });
      return await this.calculateSentiment(messages);
    } catch (error) {
      logger.error('Error getting sentiment analysis:', error);
      throw error;
    }
  }

  async getConversionRates(): Promise<any> {
    try {
      const campaigns = await Campaign.find();
      const totalMessages = await AIMessage.countDocuments();
      const totalConversions = await AIMessage.countDocuments({ 'metadata.converted': true });

      const conversionRate = totalMessages > 0 ? (totalConversions / totalMessages) * 100 : 0;

      return {
        totalMessages,
        totalConversions,
        conversionRate
      };
    } catch (error) {
      logger.error('Error getting conversion rates:', error);
      throw error;
    }
  }

  async getAblTestResults(campaignId: string): Promise<any> {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const messages = await AIMessage.find({ campaignId });
      const variants = campaign.variants || [];

      const results = variants.map(variant => {
        const variantMessages = messages.filter(m => m.metadata?.variant?.id === variant.id);
        const replies = variantMessages.filter(m => m.role === 'assistant').length;
        const conversions = variantMessages.filter(m => m.metadata?.converted).length;

        return {
          variantId: variant.id,
          name: variant.name,
          totalMessages: variantMessages.length,
          replyRate: variantMessages.length > 0 ? (replies / variantMessages.length) * 100 : 0,
          conversionRate: variantMessages.length > 0 ? (conversions / variantMessages.length) * 100 : 0
        };
      });

      return results;
    } catch (error) {
      logger.error('Error getting A/B test results:', error);
      throw error;
    }
  }

  private async calculateSentiment(messages: any[]): Promise<{ positive: number; negative: number }> {
    const positiveMessages = messages.filter(m => m.sentiment > 0).length;
    const negativeMessages = messages.filter(m => m.sentiment < 0).length;
    const totalMessages = messages.length;

    return {
      positive: totalMessages > 0 ? (positiveMessages / totalMessages) * 100 : 0,
      negative: totalMessages > 0 ? (negativeMessages / totalMessages) * 100 : 0
    };
  }
}

export const analyticsService = new AnalyticsService();
