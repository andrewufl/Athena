export interface Conversation {
  id: string;
  workspaceId: string;
  userId: string;
  campaignId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
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
  metadata: AIMessageMetadata;
}

export type AIMessageMetadata = {
  templateId?: string;
  variant?: {
    id: string;
    name: string;
  } | null;
  context?: {
    user?: {
      name: string;
      email: string;
    } | null;
    product?: {
      name: string;
      description: string;
    } | null;
  } | null;
  converted?: boolean;
  conversionData?: {
    timestamp: string | null;
    source: string;
    details: any;
  } | null;
  timestamp: string;
};
