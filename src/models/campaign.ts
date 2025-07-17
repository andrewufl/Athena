import mongoose, { Schema, Document } from 'mongoose';

interface Performance {
  totalMessages: number;
  successfulReplies: number;
  responseRate: number;
  conversionRate: number;
}

interface Recipient {
  userId: string;
  status: 'pending' | 'sent' | 'failed' | 'converted';
  message?: string;
  sentAt?: Date;
  convertedAt?: Date;
}

interface Variant {
  id: string;
  name: string;
  messageTemplate: string;
  templateVariables: Map<string, string>;
  status: 'active' | 'inactive';
  distribution: number; // percentage
}

interface CampaignDocument extends Document {
  name: string;
  workspaceId: mongoose.Types.ObjectId;
  targetChannel: string;
  messageTemplate: string;
  templateVariables: Map<string, string>;
  variants: Variant[];
  schedule: {
    startTime: Date;
    endTime: Date;
    frequency: 'once' | 'daily' | 'weekly';
  };
  status: 'active' | 'failed' | 'draft' | 'paused' | 'completed';
  messageCount: number;
  performance: Performance;
  recipients: Recipient[];
  createdBy: mongoose.Types.ObjectId;
  lastModifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<CampaignDocument>({
  name: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  targetChannel: {
    type: String,
    required: true,
  },
  messageTemplate: {
    type: String,
    required: true,
  },
  templateVariables: {
    type: Map,
    of: String,
    default: new Map(),
  },
  variants: [{
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    messageTemplate: {
      type: String,
      required: true,
    },
    templateVariables: {
      type: Map,
      of: String,
      default: new Map(),
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    distribution: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
  }],
  schedule: {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly'],
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'failed', 'draft', 'paused', 'completed'],
    default: 'draft',
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  performance: {
    totalMessages: {
      type: Number,
      default: 0,
    },
    successfulReplies: {
      type: Number,
      default: 0,
    },
    responseRate: {
      type: Number,
      default: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
  },
  recipients: [{
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'converted'],
      default: 'pending',
    },
    message: {
      type: String,
    },
    sentAt: {
      type: Date,
    },
    convertedAt: {
      type: Date,
    },
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

campaignSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
campaignSchema.index({ workspaceId: 1, status: 1 });
campaignSchema.index({ 'schedule.startTime': 1 });

export type Campaign = mongoose.InferSchemaType<typeof campaignSchema>;

export { CampaignDocument };

export const Campaign = mongoose.model<CampaignDocument>('Campaign', campaignSchema);
