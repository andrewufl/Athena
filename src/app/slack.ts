import { App, ExpressReceiver } from '@slack/bolt';
import { logger } from '../config/logger';
import * as dotenv from 'dotenv';
import { SlackInstallationService } from '../services/slackInstallationService';

dotenv.config();

// TypeScript type declarations for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_CLIENT_ID: string;
      SLACK_CLIENT_SECRET: string;
      SLACK_SIGNING_SECRET: string;
      OPENAI_API_KEY: string;
      REDIS_URL: string;
      PORT: string;
      NODE_ENV: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
    }
  }
}

export const setupSlackApp = (): { app: App, expressReceiver: ExpressReceiver } => {
  const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_SIGNING_SECRET } = process.env;

  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET || !SLACK_SIGNING_SECRET) {
    throw new Error('Slack environment variables are not configured');
  }

  const expressReceiver = new ExpressReceiver({
    signingSecret: SLACK_SIGNING_SECRET,
    clientId: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET,
    scopes: ['chat:write', 'channels:read', 'channels:write', 'groups:read', 'groups:write', 'im:read', 'im:write', 'mpim:read', 'mpim:write', 'users:read', 'users:read.email'],
    installationStore: {
      storeInstallation: async (installation) => {
        await SlackInstallationService.storeInstallation(installation);
      },
      fetchInstallation: async (query) => {
        const installation = await SlackInstallationService.fetchInstallation(query);
        if (!installation) {
          throw new Error('Installation not found');
        }
        return {
          clientId: installation.clientId,
          team: {
            id: installation.team?.id || '',
            name: installation.team?.name || ''
          },
          enterprise: {
            id: installation.enterprise?.id || '',
            name: installation.enterprise?.name || ''
          },
          user: {
            id: installation.user?.id || '',
            token: installation.bot?.token || '',
            scopes: installation.scopes || []
          },
          bot: {
            id: installation.bot?.userId || '',
            userId: installation.bot?.userId || '',
            token: installation.bot?.token || '',
            scopes: installation.scopes || []
          },
          isEnterpriseInstall: installation.isEnterpriseInstall,
          scopes: installation.scopes
        };
      },
      deleteInstallation: async (query) => {
        await SlackInstallationService.deleteInstallation(query);
      }
    }
  });

  const app = new App({
    receiver: expressReceiver,
    installerOptions: {
      installPath: '/slack/install',
      callbackPath: '/slack/oauth_redirect',
      successPath: '/slack/success',
      failurePath: '/slack/failure'
    }
  });

  const app = new App({
    receiver: expressReceiver
  });

  return { app, expressReceiver };

  // Add event handlers
  app.event('app_mention', async ({ event, context, client }) => {
    try {
      await client.chat.postMessage({
        channel: event.channel,
        text: 'Hello! I am Albert, your AI assistant. How can I help you today?'
      });
    } catch (error) {
      console.error('Error handling app mention:', error);
    }
  });

  return app;

  // Event handlers
  app.event('message', async ({ event, say }) => {
    try {
      logger.info('Received message event:', event);
      
      // Handle message event
      if ('message' in event && event.message && 'text' in event.message) {
        await say({
          text: `Received your message: ${event.message.text}`
        });
        return;
      }

      if ('text' in event) {
        await say({
          text: `Received your message: ${event.text}`
        });
        return;
      }

      logger.warn('No text found in message event:', event);
    } catch (error) {
      logger.error('Error handling message event:', error);
    }
  });

  app.event('app_home_opened', async ({ event, client }) => {
    try {
      logger.info('App home opened for user:', event.user);
      
      // Send welcome message
      await client.chat.postMessage({
        channel: event.channel,
        text: 'Welcome to Albert! How can I assist you today?'
      });
    } catch (error) {
      logger.error('Error handling app home opened:', error);
    }
  });

  return app;
};
