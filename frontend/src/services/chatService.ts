import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Conversation {
  id: string;
  workspaceId: string;
  userId: string;
  campaignId: string;
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  lastMessage: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
  };
  status: 'active' | 'pending' | 'converted' | 'archived';
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sentiment: number;
  metadata: {
    templateId?: string;
    variant?: {
      id: string;
      name: string;
    };
    context?: {
      user: {
        name?: string;
        email?: string;
      };
      product?: {
        name?: string;
        description?: string;
      }
    };
    converted?: boolean;
    conversionData?: {
      timestamp: string | null;
      source: string;
      details: any;
    };
  };
}

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConversation: async (conversationId: string): Promise<Conversation> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
        content
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (conversationId: string): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/chat/conversations/${conversationId}/read`);
    } catch (error) {
      throw error;
    }
  },

  archiveConversation: async (conversationId: string): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/chat/conversations/${conversationId}/archive`);
    } catch (error) {
      throw error;
    }
  }
};
