import { Conversation, Message } from '../types/chat';
import { AIMessage } from '../models/aiMessage';
import { Workspace } from '../models/workspace';
import { Campaign } from '../models/campaign';
import { logger } from '../config/logger';
import { SlackService } from './slackService';
import { AIMessageMetadata } from '../types/aiMessage';

export class ChatService {
  private readonly slackService: SlackService;

  constructor() {
    this.slackService = new SlackService();
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const messages = await AIMessage.find()
        .sort({ 'metadata.timestamp': -1 })
        .populate('workspaceId', 'name')
        .populate('userId', 'name email avatar')
        .populate('campaignId', 'name');

      const conversations = await Promise.all(
        messages.map(async (message) => {
          const conversation = await AIMessage.find({
            workspaceId: message.workspaceId,
            userId: message.userId,
            campaignId: message.campaignId,
          })
            .sort({ 'metadata.timestamp': -1 })
            .limit(1);

          if (conversation.length === 0) return null;

          const user = await this.slackService.getUserById(message.userId);
          const workspace = await Workspace.findById(message.workspaceId);
          const campaign = await Campaign.findById(message.campaignId);

          return {
            id: message._id.toString(),
            workspaceId: message.workspaceId,
            userId: message.userId,
            campaignId: message.campaignId,
            user: {
              id: message.userId,
              name: user?.name || '',
              email: user?.email,
              avatar: user?.avatar,
            },
            workspace: {
              id: message.workspaceId,
              name: workspace?.name || '',
            },
            lastMessage: {
              id: conversation[0]._id.toString(),
              content: conversation[0].content,
              role: conversation[0].role,
              timestamp: conversation[0].metadata?.timestamp || new Date().toISOString(),
            },
            status: message.metadata?.converted ? 'converted' : 'active',
            unreadCount: await this.getUnreadCount(message._id.toString()),
          };
        })
      );

      return conversations.filter((c): c is Conversation => c !== null && typeof c === 'object' && c !== null) as Conversation[];
    } catch (error) {
      logger.error('Failed to get conversations:', error);
      throw error;
    }
  }

  async getConversation(id: string): Promise<Conversation> {
    try {
      const messages = await AIMessage.find({ _id: id })
        .populate('workspaceId', 'name')
        .populate('userId', 'name email avatar')
        .populate('campaignId', 'name');

      if (messages.length === 0) {
        throw new Error('Conversation not found');
      }

      const message = messages[0];
      const user = await this.slackService.getUserById(message.userId);
      const workspace = await Workspace.findById(message.workspaceId);
      const campaign = await Campaign.findById(message.campaignId);

      const metadata: AIMessageMetadata = message.metadata || {
        timestamp: new Date(),
        converted: false
      };

      return {
        id,
        workspaceId: message.workspaceId.toString(),
        userId: message.userId.toString(),
        campaignId: message.campaignId.toString(),
        user: {
          id: message.userId.toString(),
          name: user?.name || '',
          email: user?.email,
          avatar: user?.avatar,
        },
        workspace: {
          id: message.workspaceId.toString(),
          name: workspace?.name || '',
        },
        lastMessage: {
          id: message._id.toString(),
          content: message.content,
          role: message.role,
          timestamp: new Date().toISOString(),
        },
        status: metadata.converted ? 'converted' : 'active',
        unreadCount: await this.getUnreadCount(id),
      };
    } catch (error) {
      logger.error('Failed to get conversation:', error);
      throw error;
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const message = await AIMessage.findById(conversationId);
      if (!message) {
        throw new Error('Conversation not found');
      }

      const user = await this.slackService.getUserById(message.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create message object with proper types
      const messageObj = {
        id: message._id.toString(),
        content: message.content,
        role: message.role,
        timestamp: message.createdAt.toISOString(),
        sentiment: message.sentiment,
        metadata: {
          templateId: message.metadata?.templateId || '',
          variant: message.metadata?.variant || undefined,
          context: message.metadata?.context || undefined,
          converted: message.metadata?.converted || false,
          conversionData: message.metadata?.conversionData || undefined,
          timestamp: message.metadata?.timestamp || new Date().toISOString()
        }
      } as Message;

      const metadata = message.metadata || {
        timestamp: new Date().toISOString(),
        converted: false,
        templateId: '',
        variant: undefined,
        context: undefined,
        conversionData: undefined
      };

      // Use default values if metadata is undefined
      const defaultMetadata = {
        timestamp: new Date().toISOString(),
        converted: false,
        templateId: '',
        variant: { id: '', name: '' },
        context: { user: { name: '', email: '' }, product: { name: '', description: '' } },
        conversionData: { timestamp: null, source: '', details: {} }
      };

      const finalMetadata = {
        ...defaultMetadata,
        ...metadata
      };

      const newMessage: Message = {
        id: message._id.toString(),
        content,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sentiment: 0, // TODO: Add sentiment analysis
        metadata: finalMetadata
      };

      await AIMessage.updateOne(
        { _id: conversationId },
        {
          $set: {
            content,
            timestamp: new Date(),
            metadata: {
              ...message.metadata,
              timestamp: new Date(),
            },
          },
        }
      );

      return {
        id: message._id.toString(),
        content: message.content,
        role: message.role,
        timestamp: message.createdAt.toISOString(),
        sentiment: message.sentiment,
        metadata: message.metadata
      } as Message;
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw error;
    }
  }

  async markAsRead(conversationId: string): Promise<void> {
    try {
      await AIMessage.updateOne(
        { _id: conversationId },
        { $set: { 'metadata.readAt': new Date() } }
      );
    } catch (error) {
      logger.error('Failed to mark conversation as read:', error);
      throw error;
    }
  }

  async archiveConversation(conversationId: string): Promise<void> {
    try {
      await AIMessage.updateOne(
        { _id: conversationId },
        { $set: { status: 'archived' } }
      );
    } catch (error) {
      logger.error('Failed to archive conversation:', error);
      throw error;
    }
  }

  private async getUnreadCount(conversationId: string): Promise<number> {
    try {
      const message = await AIMessage.findById(conversationId);
      if (!message) return 0;

      const userMessages = await AIMessage.find({
        workspaceId: message.workspaceId,
        userId: message.userId,
        campaignId: message.campaignId,
        role: 'user',
        'metadata.readAt': { $exists: false },
      });

      return userMessages.length;
    } catch (error) {
      logger.error('Failed to get unread count:', error);
      return 0;
    }
  }
}
