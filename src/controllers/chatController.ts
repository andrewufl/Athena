import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { logger } from '../config/logger';
import { AIMessageMetadata } from '../types/aiMessage';
import { Message } from '../types/chat';

export class ChatController {
  private readonly chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  getConversations = async (req: Request, res: Response): Promise<void> => {
    try {
      const conversations = await this.chatService.getConversations();
      res.json(conversations);
    } catch (error) {
      logger.error('Failed to get conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  };

  getConversation = async (req: Request, res: Response): Promise<void> => {
    try {
      const conversation = await this.chatService.getConversation(req.params.id);
      res.json(conversation);
    } catch (error) {
      logger.error('Failed to get conversation:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content } = req.body;
      const message = await this.chatService.sendMessage(req.params.id, content);
      const responseMessage: Message = {
        id: message.id,
        content: message.content,
        role: message.role,
        timestamp: message.timestamp,
        sentiment: message.sentiment,
        metadata: message.metadata
      };
      res.json(responseMessage);
    } catch (error) {
      logger.error('Failed to send message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };

  markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.chatService.markAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to mark conversation as read:', error);
      res.status(500).json({ error: 'Failed to mark conversation as read' });
    }
  };

  archiveConversation = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.chatService.archiveConversation(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to archive conversation:', error);
      res.status(500).json({ error: 'Failed to archive conversation' });
    }
  };
}
