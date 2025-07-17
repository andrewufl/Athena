import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { logger } from '../config/logger';

export interface SlackUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SlackWorkspace {
  id: string;
  name: string;
  token: string;
  joinDate: Date;
  status: 'active' | 'inactive';
}

export class SlackService {
  private app: App;
  private webClient: WebClient;

  constructor() {
    const { SLACK_APP_TOKEN, SLACK_BOT_TOKEN } = process.env;
    
    if (!SLACK_APP_TOKEN || !SLACK_BOT_TOKEN) {
      throw new Error('Slack tokens are not configured');
    }

    this.app = new App({
      token: SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET || '',
      socketMode: true,
      appToken: SLACK_APP_TOKEN,
    });

    this.webClient = new WebClient(SLACK_BOT_TOKEN);
  }

  // Get user info by ID
  async getUserById(userId: string): Promise<SlackUser> {
    try {
      const response = await this.webClient.users.info({
        user: userId
      });

      if (!response.ok || !response.user) {
        throw new Error('Failed to get user info');
      }

      const profile = response.user.profile || {};
      return {
        id: response.user.id,
        name: response.user.real_name || response.user.name,
        email: profile.email || '',
        avatar: profile.image_512 || ''
      } as SlackUser;
    } catch (error) {
      logger.error('Failed to get user info:', error);
      throw error;
    }
  }

  // Join a workspace
  async joinWorkspace(token: string): Promise<SlackWorkspace> {
    try {
      if (!token) {
        throw new Error('Token is required');
      }

      const response = await this.webClient.auth.test({ token });
      
      if (!response.user_id || !response.user) {
        throw new Error('Invalid Slack auth response');
      }

      return {
        id: response.user_id,
        name: response.user,
        token,
        joinDate: new Date(),
        status: 'active'
      };
    } catch (error) {
      logger.error('Failed to join workspace:', error);
      throw error;
    }
  }

  // Get channel members
  async getChannelMembers(channelId: string): Promise<string[]> {
    try {
      const response = await this.webClient.conversations.members({
        channel: channelId
      });

      return response.members || [];
    } catch (error) {
      logger.error('Failed to get channel members:', error);
      throw error;
    }
  }

  // Send message
  async sendMessage(channel: string, message: string): Promise<void> {
    try {
      await this.webClient.chat.postMessage({
        channel,
        text: message
      });
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw error;
    }
  }

  // Handle incoming events
  async handleEvent(event: any): Promise<void> {
    try {
      logger.info('Received Slack event:', event.type);
      
      // Handle different event types
      switch (event.type) {
        case 'message':
          await this.handleMessage(event);
          break;
        case 'app_home_opened':
          await this.handleAppHomeOpened(event);
          break;
        // Add more event handlers as needed
      }
    } catch (error) {
      logger.error('Error handling event:', error);
      throw error;
    }
  }

  // Event handlers
  private async handleMessage(event: any): Promise<void> {
    // Implement message handling logic
  }

  private async handleAppHomeOpened(event: any): Promise<void> {
    // Implement app home handling logic
  }

  // Get app instance
  getApp(): App {
    return this.app;
  }
}
