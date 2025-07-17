import { Request, Response } from 'express';
import { CampaignService } from '../services/campaignService';
import { logger } from '../config/logger';
import { Campaign } from '../models/campaign';

export class CampaignController {
  private campaignService: CampaignService;

  constructor() {
    this.campaignService = new CampaignService();
  }

  // Create campaign
  async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaign = await this.campaignService.createCampaign(req.body);
      res.status(201).json(campaign);
    } catch (error) {
      logger.error('Failed to create campaign:', error);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  }

  // Get campaign by ID
  async getCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaign = await this.campaignService.getCampaignAnalytics(req.params.id);
      res.json(campaign);
    } catch (error) {
      logger.error('Failed to get campaign:', error);
      res.status(500).json({ error: 'Failed to get campaign' });
    }
  }

  // List campaigns
  async listCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId, status } = req.query;
      
      const query: any = {};
      if (workspaceId) query.workspaceId = workspaceId;
      if (status) query.status = status;

      const campaigns = await Campaign.find(query)
        .populate('workspaceId')
        .sort({ createdAt: -1 }) as any[];

      res.json(campaigns);
    } catch (error) {
      logger.error('Failed to list campaigns:', error);
      res.status(500).json({ error: 'Failed to list campaigns' });
    }
  }

  // Update campaign status
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      await this.campaignService.updateStatus(req.params.id, status);
      res.json({ status: 'success' });
    } catch (error) {
      logger.error('Failed to update campaign status:', error);
      res.status(500).json({ error: 'Failed to update campaign status' });
    }
  }

  // Send campaign messages
  async sendMessages(req: Request, res: Response): Promise<void> {
    try {
      await this.campaignService.sendMessages(req.params.id);
      res.json({ status: 'success' });
    } catch (error) {
      logger.error('Failed to send campaign messages:', error);
      res.status(500).json({ error: 'Failed to send campaign messages' });
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = await this.campaignService.getCampaignAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      logger.error('Failed to get campaign analytics:', error);
      res.status(500).json({ error: 'Failed to get campaign analytics' });
    }
  }
}
