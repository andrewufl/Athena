import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { logger } from '../config/logger';

export class AnalyticsController {
  async getCampaignAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = await analyticsService.getCampaignAnalytics();
      res.json(analytics);
    } catch (error) {
      logger.error('Failed to get campaign analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  async getSentimentAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      const analysis = await analyticsService.getSentimentAnalysis(campaignId);
      res.json(analysis);
    } catch (error) {
      logger.error('Failed to get sentiment analysis:', error);
      res.status(500).json({ error: 'Failed to fetch sentiment analysis' });
    }
  }

  async getConversionRates(req: Request, res: Response): Promise<void> {
    try {
      const rates = await analyticsService.getConversionRates();
      res.json(rates);
    } catch (error) {
      logger.error('Failed to get conversion rates:', error);
      res.status(500).json({ error: 'Failed to fetch conversion rates' });
    }
  }

  async getAblTestResults(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      const results = await analyticsService.getAblTestResults(campaignId);
      res.json(results);
    } catch (error) {
      logger.error('Failed to get A/B test results:', error);
      res.status(500).json({ error: 'Failed to fetch A/B test results' });
    }
  }
}
