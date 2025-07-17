export interface AIMessageMetadata {
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
}

export interface AIMessage {
  _id: string;
  workspaceId: string;
  userId: string;
  campaignId: string;
  channelId: string;
  content: string;
  role: 'user' | 'assistant';
  sentiment: number;
  metadata: AIMessageMetadata;
  createdAt: Date;
  updatedAt: Date;
}
