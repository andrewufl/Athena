import mongoose, { Schema, Document } from 'mongoose';

interface WorkspaceDocument extends Document {
  name: string;
  slackWorkspaceId: string;
  status: 'active' | 'inactive' | 'suspended';
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>({
  name: {
    type: String,
    required: true,
  },
  slackWorkspaceId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

workspaceSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export { WorkspaceDocument };

export const Workspace = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);
