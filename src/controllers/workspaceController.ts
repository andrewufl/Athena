import { Request, Response } from 'express';
import { Workspace } from '../models/workspace';
import { logger } from '../utils/logger';

export class WorkspaceController {
  async listWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const query = status ? { status: status as string } : {};
      const workspaces = await Workspace.find(query);
      res.json(workspaces);
    } catch (error) {
      logger.error('Failed to list workspaces:', error);
      res.status(500).json({ error: 'Failed to list workspaces' });
    }
  }

  async getWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const workspace = await Workspace.findById(req.params.id);
      if (!workspace) {
        res.status(404).json({ error: 'Workspace not found' });
        return;
      }
      res.json(workspace);
    } catch (error) {
      logger.error('Failed to get workspace:', error);
      res.status(500).json({ error: 'Failed to get workspace' });
    }
  }

  async createWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const workspace = new Workspace(req.body);
      await workspace.save();
      res.status(201).json(workspace);
    } catch (error) {
      logger.error('Failed to create workspace:', error);
      res.status(500).json({ error: 'Failed to create workspace' });
    }
  }

  async updateWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const workspace = await Workspace.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!workspace) {
        res.status(404).json({ error: 'Workspace not found' });
        return;
      }
      res.json(workspace);
    } catch (error) {
      logger.error('Failed to update workspace:', error);
      res.status(500).json({ error: 'Failed to update workspace' });
    }
  }

  async deleteWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const workspace = await Workspace.findByIdAndDelete(req.params.id);
      if (!workspace) {
        res.status(404).json({ error: 'Workspace not found' });
        return;
      }
      res.json({ message: 'Workspace deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete workspace:', error);
      res.status(500).json({ error: 'Failed to delete workspace' });
    }
  }
}

export const workspaceController = new WorkspaceController();
