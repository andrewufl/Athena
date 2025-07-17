import { Router } from 'express';
import { dashboardController } from '@/controllers/dashboardController';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Dashboard stats
router.get('/stats', authenticate, dashboardController.getDashboardStats);

// Recent campaigns
router.get('/campaigns', authenticate, dashboardController.getRecentCampaigns);

// Active workspaces
router.get('/workspaces', authenticate, dashboardController.getActiveWorkspaces);

export default router;
