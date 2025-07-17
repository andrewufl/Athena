import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const dashboardService = {
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecentCampaigns: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/campaigns`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getActiveWorkspaces: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/workspaces`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
