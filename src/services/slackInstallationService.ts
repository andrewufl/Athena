import { SlackInstallation } from '../models/slackInstallation';

export class SlackInstallationService {
  static async storeInstallation(installation: any) {
    try {
      const existingInstallation = await SlackInstallation.findOne({
        'team.id': installation.team.id,
        isEnterpriseInstall: installation.isEnterpriseInstall
      });

      if (existingInstallation) {
        // Update existing installation
        const updatedInstallation = await SlackInstallation.findOneAndUpdate(
          { 'team.id': installation.team.id, isEnterpriseInstall: installation.isEnterpriseInstall },
          installation,
          { new: true, upsert: true }
        );
        return updatedInstallation;
      }

      // Create new installation
      const newInstallation = new SlackInstallation(installation);
      return await newInstallation.save();
    } catch (error) {
      console.error('Error storing Slack installation:', error);
      throw error;
    }
  }

  static async fetchInstallation(query: any) {
    try {
      return await SlackInstallation.findOne({
        'team.id': query.team.id,
        isEnterpriseInstall: query.isEnterpriseInstall
      });
    } catch (error) {
      console.error('Error fetching Slack installation:', error);
      throw error;
    }
  }

  static async deleteInstallation(query: any) {
    try {
      return await SlackInstallation.deleteOne({
        'team.id': query.team.id,
        isEnterpriseInstall: query.isEnterpriseInstall
      });
    } catch (error) {
      console.error('Error deleting Slack installation:', error);
      throw error;
    }
  }
}
