import mongoose, { Model } from 'mongoose';
import { CampaignDocument } from '@/models/campaign';
import { WorkspaceDocument } from '@/models/workspace';
import { Campaign } from '@/models/campaign';
import { Workspace } from '@/models/workspace';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalMessages: number;
  conversionRate: number;
}

export class DashboardService {
  constructor(
    private readonly campaignModel: Model<CampaignDocument>,
    private readonly workspaceModel: Model<WorkspaceDocument>,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const stats = await this.campaignModel.aggregate([
        {
          $group: {
            _id: null,
            totalCampaigns: { $sum: 1 },
            activeCampaigns: {
              $sum: {
                $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
              },
            },
            totalMessages: { $sum: '$messageCount' },
          },
        },
        {
          $project: {
            _id: 0,
            totalCampaigns: 1,
            activeCampaigns: 1,
            totalMessages: 1,
            conversionRate: {
              $multiply: [
                {
                  $divide: [
                    {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: '$recipients',
                              as: 'recipient',
                              cond: {
                                $eq: ['$$recipient.status', 'converted'],
                              },
                            },
                          },
                          as: 'recipient',
                          in: 1,
                        },
                      },
                    },
                    {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: '$recipients',
                              as: 'recipient',
                              cond: {
                                $or: [
                                  { $eq: ['$$recipient.status', 'converted'] },
                                  { $eq: ['$$recipient.status', 'failed'] },
                                  { $eq: ['$$recipient.status', 'pending'] },
                                ],
                              },
                            },
                          },
                          as: 'recipient',
                          in: 1,
                        },
                      },
                    },
                  ],
                },
                100
              ],
            },
          },
        },
      ]).exec();

      if (!stats) {
        return {
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalMessages: 0,
          conversionRate: 0,
        };
      }

      return stats[0];
    } catch (error: unknown) {
      throw error;
    }
  }

  async getRecentCampaigns(): Promise<CampaignDocument[]> {
    try {
      const result = await this.campaignModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .exec();
      return result || [];
    } catch (error: unknown) {
      throw error;
    }
  }

  async getActiveWorkspaces(): Promise<WorkspaceDocument[]> {
    try {
      const result = await this.workspaceModel.find({ status: 'active' })
        .exec();
      return result || [];
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const dashboardService = new DashboardService(Campaign, Workspace);
