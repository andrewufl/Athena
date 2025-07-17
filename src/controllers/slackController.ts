import { Request, Response } from 'express';
import { SlackService } from '../services/slackService';
import { SlackWorkspace } from '../models/slackWorkspace';
import { logger } from '../config/logger';

export class SlackController {
  private slackService: SlackService;

  constructor() {
    this.slackService = new SlackService();
  }

  // Handle Slack OAuth callback
  async oauthCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.query;
      
      if (!code) {
        throw new Error('Missing OAuth code');
      }

      // Join workspace with the provided token
      const workspace = await this.slackService.joinWorkspace(code as string);
      await SlackWorkspace.create({
        workspaceId: workspace.id,
        name: workspace.name,
        token: code as string
      });

      res.redirect('/slack/success');
    } catch (error) {
      logger.error('OAuth callback error:', error);
      res.redirect('/slack/error');
    }
  }

  // Get workspace information
  async getWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const workspace = await SlackWorkspace.findById(workspaceId);
      
      if (!workspace) {
        res.status(404).json({ error: 'Workspace not found' });
        return;
      }

      res.json({
        id: workspace.workspaceId,
        name: workspace.name,
        status: workspace.status,
        channels: workspace.channels
      });
    } catch (error) {
      logger.error('Get workspace error:', error);
      res.status(500).json({ error: 'Failed to get workspace information' });
    }
  }

  // List all workspaces
  async listWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const workspaces = await SlackWorkspace.find({}, {
        token: 0 // Don't include token in response
      });
      
      res.json(workspaces);
    } catch (error) {
      logger.error('List workspaces error:', error);
      res.status(500).json({ error: 'Failed to list workspaces' });
    }
  }

  // Handle Slack events
  async handleEvent(req: Request, res: Response): Promise<void> {
    try {
      await this.slackService.handleEvent(req.body);
      res.status(200).send('OK');
    } catch (error) {
      logger.error('Event handling error:', error);
      res.status(500).send('Error handling event');
    }
  }
}
