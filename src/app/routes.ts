import express from 'express';
import { SlackController } from '../controllers/slackController';
import { AIController } from '../controllers/aiController';
import { MessageQueueController } from '../controllers/messageQueueController';
import { CampaignController } from '../controllers/campaignController';
import { DashboardController } from '../controllers/dashboardController';
import { WorkspaceController } from '../controllers/workspaceController';
import { HealthCheckController } from '../controllers/healthCheckController';
import { AnalyticsController } from '../controllers/analyticsController';
import { ChatController } from '../controllers/chatController';

export const setupRoutes = (app: express.Application): void => {
  const slackController = new SlackController();
  const aiController = new AIController();
  const messageQueueController = new MessageQueueController();
  const campaignController = new CampaignController();
  const dashboardController = new DashboardController();
  const workspaceController = new WorkspaceController();
  const healthCheckController = new HealthCheckController();
  const analyticsController = new AnalyticsController();
  const chatController = new ChatController();
  const router = express.Router();

  // Slack routes
  router.get('/slack/oauth/callback', slackController.oauthCallback.bind(slackController));
  router.get('/slack/workspaces', slackController.listWorkspaces.bind(slackController));
  router.get('/slack/workspaces/:workspaceId', slackController.getWorkspace.bind(slackController));
  router.post('/slack/events', slackController.handleEvent.bind(slackController));

  // AI routes
  router.post('/ai/init', aiController.initialize.bind(aiController));
  router.post('/ai/generate', aiController.generateMessage.bind(aiController));
  router.post('/ai/sentiment', aiController.analyzeSentiment.bind(aiController));
  router.get('/ai/conversation/:workspaceId/:userId', aiController.getConversation.bind(aiController));
  router.post('/ai/templates', aiController.addTemplate.bind(aiController));

  // Message Queue routes
  router.post('/queue/message', messageQueueController.addMessage.bind(messageQueueController));
  router.get('/queue/status', messageQueueController.getStatus.bind(messageQueueController));
  router.delete('/queue/clear', messageQueueController.clearQueue.bind(messageQueueController));

  // Campaign routes
  router.post('/campaigns', campaignController.createCampaign.bind(campaignController));
  router.get('/campaigns/:id', campaignController.getCampaign.bind(campaignController));
  router.get('/campaigns', campaignController.listCampaigns.bind(campaignController));
  router.put('/campaigns/:id/status', campaignController.updateStatus.bind(campaignController));
  router.post('/campaigns/:id/send', campaignController.sendMessages.bind(campaignController));
  router.get('/campaigns/:id/analytics', campaignController.getCampaignAnalytics.bind(campaignController));

// Dashboard routes
  router.get('/dashboard/stats', dashboardController.getDashboardStats.bind(dashboardController));
  router.get('/dashboard/campaigns', dashboardController.getRecentCampaigns.bind(dashboardController));
  router.get('/dashboard/workspaces', dashboardController.getActiveWorkspaces.bind(dashboardController));




  // Analytics routes
  router.get('/analytics/campaigns', analyticsController.getCampaignAnalytics.bind(analyticsController));
  router.get('/analytics/sentiment/:campaignId', analyticsController.getSentimentAnalysis.bind(analyticsController));
  router.get('/analytics/conversion-rates', analyticsController.getConversionRates.bind(analyticsController));
  router.get('/analytics/ab-test/:campaignId', analyticsController.getAblTestResults.bind(analyticsController));

  // Chat routes
  router.get('/chat/conversations', chatController.getConversations.bind(chatController));
  router.get('/chat/conversations/:id', chatController.getConversation.bind(chatController));
  router.post('/chat/conversations/:id/messages', chatController.sendMessage.bind(chatController));
  router.post('/chat/conversations/:id/read', chatController.markAsRead.bind(chatController));
  router.post('/chat/conversations/:id/archive', chatController.archiveConversation.bind(chatController));

// Health check
router.get('/health', (_, res) => {
  res.json({ status: 'healthy' });
});

  app.use('/api', router);
};
