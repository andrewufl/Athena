import express from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/stats', dashboardController.getDashboardStats);
router.get('/campaigns', dashboardController.getRecentCampaigns);
router.get('/workspaces', dashboardController.getActiveWorkspaces);

export default router;
