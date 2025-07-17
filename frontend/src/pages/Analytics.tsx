import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, Divider, useTheme, useMediaQuery, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

interface CampaignAnalytics {
  _id: string;
  name: string;
  totalMessages: number;
  replyRate: number;
  positiveSentiment: number;
  negativeSentiment: number;
  conversionRate: number;
}

const Analytics: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getCampaignAnalytics();
        setCampaigns(data);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const barChartWidth = isMobile ? '100%' : 600;
  const barChartHeight = isMobile ? 300 : 400;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Campaign Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} key={campaign._id}>
            <Card>
              <CardHeader title={campaign.name} />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Key Metrics
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Total Messages: {campaign.totalMessages}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Reply Rate: {campaign.replyRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Conversion Rate: {campaign.conversionRate}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Sentiment Analysis
                    </Typography>
                    <ResponsiveContainer width={barChartWidth} height={barChartHeight}>
                      <BarChart data={[
                        { name: 'Positive', value: campaign.positiveSentiment },
                        { name: 'Negative', value: campaign.negativeSentiment }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export { Analytics };
