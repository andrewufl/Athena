export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  createdAt: Date;
}

export interface MessageContext {
  conversation: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  metadata: {
    userId: string;
    workspaceId: string;
    campaignId: string;
  };
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
  metadata: {
    templateId?: string;
    context?: {
      user: {
        name?: string;
        email?: string;
      };
      product: {
        name?: string;
        description?: string;
      }
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
