import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const analyticsService = {
  getCampaignAnalytics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/campaigns`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSentimentAnalysis: async (campaignId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/sentiment/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConversionRates: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/conversion-rates`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAblTestResults: async (campaignId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/ab-test/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
