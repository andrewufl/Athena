import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  workspaceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  channels: [{
    id: String,
    name: String,
    members: [String]
  }]
}, {
  timestamps: true
});

export const SlackWorkspace = mongoose.model('SlackWorkspace', workspaceSchema);
