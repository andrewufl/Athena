import OpenAI from 'openai';
import { logger } from '../config/logger';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { PromptTemplate, MessageContext } from './types';



export class AIService {
  private openai: OpenAI;
  private templates: Map<string, PromptTemplate>;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    this.openai = new OpenAI({ apiKey });
    this.templates = new Map();
  }

  // Initialize AI service with templates
  async initialize(): Promise<void> {
    try {
      // Load default templates
      await this.loadDefaultTemplates();
    } catch (error) {
      logger.error('Failed to initialize AI service:', error);
      throw error;
    }
  }

  // Load default templates
  private async loadDefaultTemplates(): Promise<void> {
    const defaultTemplates: PromptTemplate[] = [
      {
        id: 'initial-contact',
        name: 'Initial Contact',
        template: `You are a helpful sales assistant. 
        Your goal is to engage with {user.name} about {product.name}.
        Context: {context}
        
        Generate a friendly, professional message.`,
        variables: ['user.name', 'product.name', 'context'],
        createdAt: new Date()
      },
      {
        id: 'follow-up',
        name: 'Follow-up Message',
        template: `You are following up with {user.name}.
        Previous conversation: {previousConversation}
        
        Generate a natural follow-up message.`,
        variables: ['user.name', 'previousConversation'],
        createdAt: new Date()
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Generate message using a template
  async generateMessage(
    templateId: string,
    context: MessageContext
  ): Promise<string> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // Prepare the conversation history
      const messages = [
        { role: 'system', content: template.template } as ChatCompletionMessageParam,
        ...context.conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Generate response
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      logger.error('Failed to generate message:', error);
      throw error;
    }
  }

  // Analyze sentiment of a message
  async analyzeSentiment(message: string): Promise<number> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Analyze the sentiment of the following message and return a score between -1 and 1' },
          { role: 'user', content: message }
        ],
        temperature: 0.2,
        max_tokens: 100,
      });

      const content = response.choices[0].message.content || '';
      const score = parseFloat(content);
      return !isNaN(score) ? score : 0;
    } catch (error) {
      logger.error('Failed to analyze sentiment:', error);
      throw error;
    }
  }

  // Get available templates
  getTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  // Add new template
  async addTemplate(template: PromptTemplate): Promise<void> {
    try {
      this.templates.set(template.id, template);
    } catch (error) {
      logger.error('Failed to add template:', error);
      throw error;
    }
  }
}
