import { model, Schema } from 'mongoose';

const SlackInstallationSchema = new Schema({
  team: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  enterprise: {
    id: { type: String },
    name: { type: String }
  },
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  bot: {
    userId: { type: String, required: true },
    token: { type: String, required: true }
  },
  isEnterpriseInstall: { type: Boolean, required: true },
  incomingWebhook: {
    channel: { type: String },
    channelName: { type: String },
    configurationUrl: { type: String },
    url: { type: String }
  },
  scopes: { type: [String], required: true },
  clientId: { type: String, required: true }
}, { timestamps: true });

export const SlackInstallation = model('SlackInstallation', SlackInstallationSchema);
