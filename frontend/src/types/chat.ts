export interface Conversation {
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

export interface Message {
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
