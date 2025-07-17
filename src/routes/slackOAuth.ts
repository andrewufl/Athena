import express from 'express';
import { setupSlackApp } from '../app/slack';
import { SlackInstallationService } from '../services/slackInstallationService';

const router = express.Router();

// Slack OAuth installation route
router.get('/install', (req, res) => {
  res.redirect('/slack/install');
});

// Slack OAuth callback route
router.use('/oauth_redirect', (req, res, next) => {
  next();
});

// Slack OAuth success route
router.get('/success', (req, res) => {
  res.send('Successfully installed Slack app! You can now close this window.');
});

// Slack OAuth failure route
router.get('/failure', (req, res) => {
  res.send('Failed to install Slack app. Please try again.');
});

export default router;
