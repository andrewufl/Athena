import { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { AIMessage } from '../models/aiMessage';
import { logger } from '../config/logger';

export class AIController {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  // Initialize AI service
  async initialize(req: Request, res: Response): Promise<void> {
    try {
      await this.aiService.initialize();
      res.json({ status: 'success', message: 'AI service initialized' });
    } catch (error) {
      logger.error('AI initialization error:', error);
      res.status(500).json({ error: 'Failed to initialize AI service' });
    }
  }

  // Generate message
  async generateMessage(req: Request, res: Response): Promise<void> {
    try {
      const { templateId, context } = req.body;
      
      if (!templateId || !context) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
      }

      const message = await this.aiService.generateMessage(templateId, context);
      
      // Save message to database
      const aiMessage = await AIMessage.create({
        ...context.metadata,
        content: message,
        role: 'assistant',
        sentiment: await this.aiService.analyzeSentiment(message)
      });

      res.json({
        message,
        metadata: {
          messageId: aiMessage._id,
          sentiment: aiMessage.sentiment
        }
      });
    } catch (error) {
      logger.error('Message generation error:', error);
      res.status(500).json({ error: 'Failed to generate message' });
    }
  }

  // Analyze message sentiment
  async analyzeSentiment(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;
      
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const sentiment = await this.aiService.analyzeSentiment(message);
      res.json({ sentiment });
    } catch (error) {
      logger.error('Sentiment analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
  }

  // Get conversation history
  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId, userId } = req.params;
      
      const messages = await AIMessage.find({
        workspaceId,
        userId
      })
      .sort({ createdAt: 1 })
      .populate('workspaceId');

      res.json(messages);
    } catch (error) {
      logger.error('Conversation retrieval error:', error);
      res.status(500).json({ error: 'Failed to get conversation history' });
    }
  }

  // Add new template
  async addTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { template } = req.body;
      
      if (!template) {
        res.status(400).json({ error: 'Template is required' });
        return;
      }

      await this.aiService.addTemplate(template);
      res.json({ status: 'success', message: 'Template added' });
    } catch (error) {
      logger.error('Template addition error:', error);
      res.status(500).json({ error: 'Failed to add template' });
    }
  }
}
