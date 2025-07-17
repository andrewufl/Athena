import express from 'express';
import dotenv from 'dotenv';
import { App } from '@slack/bolt';
import { connectDB } from './config/db';
import { setupRoutes } from './app/routes';
import { setupSlackApp } from './app/slack';
import { setupMessageQueue } from './app/messageQueue';
import { setupLogger } from './config/logger';
import slackOAuth from './routes/slackOAuth';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = setupLogger();

// Connect to database
connectDB()
  .then(() => logger.info('Database connected successfully'))
  .catch((err) => logger.error('Database connection failed', err));

// Initialize Slack app
const { app: slackApp, expressReceiver } = setupSlackApp();

// Initialize message queue
const messageQueue = setupMessageQueue();

// Initialize Express app
const app = express();

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Slack event routes
app.use(expressReceiver.app);

// Setup routes
setupRoutes(app);
app.use('/slack/oauth', slackOAuth);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
