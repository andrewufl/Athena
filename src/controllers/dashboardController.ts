import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { DashboardService } from '@/services/dashboardService';
import { Campaign } from '@/models/campaign';
import { Workspace } from '@/models/workspace';
import { logger } from '@/utils/logger';

export class DashboardController {
  private readonly dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService(Campaign, Workspace);
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      res.json(stats);
    } catch (error: unknown) {
      logger.error('Failed to get dashboard stats:', error);
      res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
  }

  async getRecentCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const campaigns = await this.dashboardService.getRecentCampaigns();
      res.json(campaigns);
    } catch (error: unknown) {
      logger.error('Failed to get recent campaigns:', error);
      res.status(500).json({ error: 'Failed to get recent campaigns' });
    }
  }

  async getActiveWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const workspaces = await this.dashboardService.getActiveWorkspaces();
      res.json(workspaces);
    } catch (error: unknown) {
      logger.error('Failed to get active workspaces:', error);
      res.status(500).json({ error: 'Failed to get active workspaces' });
    }
  }
}

export const dashboardController = new DashboardController();
