import mongoose from 'mongoose';
import { Schema, model, Document } from 'mongoose';

export interface AIMessageDocument extends Document {
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

const AIMessageSchema = new Schema({
  workspaceId: { type: String, required: true },
  userId: { type: String, required: true },
  campaignId: { type: String, required: true },
  channelId: { type: String, required: true },
  content: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  sentiment: { type: Number, required: true },
  metadata: {
    templateId: { type: String },
    variant: {
      id: { type: String },
      name: { type: String }
    },
    context: {
      user: {
        name: { type: String },
        email: { type: String }
      },
      product: {
        name: { type: String },
        description: {
          type: String,
          default: ''
        }
      }
    },
    converted: {
      type: Boolean,
      default: false
    },
    conversionData: {
      timestamp: {
        type: String,
        default: null
      },
      source: {
        type: String,
        default: ''
      },
      details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString()
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
AIMessageSchema.index({ workspaceId: 1, userId: 1, createdAt: -1 });

export const AIMessage = model<AIMessageDocument>('AIMessage', AIMessageSchema);
