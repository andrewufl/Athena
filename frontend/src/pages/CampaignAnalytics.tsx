import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

interface AnalyticsData {
  date: string;
  messagesSent: number;
  responses: number;
  conversions: number;
}

const CampaignAnalytics = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [campaign, setCampaign] = useState({
    name: '',
    status: '',
    workspace: '',
    channel: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    // TODO: Implement API call to fetch campaign analytics
    const mockData: AnalyticsData[] = [
      { date: '2025-07-01', messagesSent: 100, responses: 20, conversions: 5 },
      { date: '2025-07-02', messagesSent: 150, responses: 30, conversions: 8 },
      { date: '2025-07-03', messagesSent: 200, responses: 40, conversions: 12 },
      { date: '2025-07-04', messagesSent: 250, responses: 50, conversions: 15 },
      { date: '2025-07-05', messagesSent: 300, responses: 60, conversions: 20 },
    ];

    const mockCampaign = {
      name: 'Summer Promotion Campaign',
      status: 'active',
      workspace: 'Marketing Team',
      channel: '#sales',
      startDate: '2025-07-01',
      endDate: '2025-07-31',
    };

    setAnalytics(mockData);
    setCampaign(mockCampaign);
    setLoading(false);
  }, [id]);

  const calculateMetrics = () => {
    const totalMessages = analytics.reduce((sum, data) => sum + data.messagesSent, 0);
    const totalResponses = analytics.reduce((sum, data) => sum + data.responses, 0);
    const totalConversions = analytics.reduce((sum, data) => sum + data.conversions, 0);
    const responseRate = totalMessages ? (totalResponses / totalMessages) * 100 : 0;
    const conversionRate = totalResponses ? (totalConversions / totalResponses) * 100 : 0;

    return {
      totalMessages,
      totalResponses,
      totalConversions,
      responseRate,
      conversionRate,
    };
  };

  const metrics = calculateMetrics();

  const renderChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={analytics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="messagesSent" name="Messages Sent" stroke="#8884d8" />
        <Line type="monotone" dataKey="responses" name="Responses" stroke="#82ca9d" />
        <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campaign Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Campaign Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Campaign Name
                  </Typography>
                  <Typography variant="h5" component="div">
                    {campaign.name}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: campaign.status === 'active' ? 'success.main' : 'error.main',
                      color: 'white',
                    }}
                  >
                    {campaign.status}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Workspace
                  </Typography>
                  <Typography variant="h5" component="div">
                    {campaign.workspace}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Channel
                  </Typography>
                  <Typography variant="h5" component="div">
                    {campaign.channel}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Performance Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Messages
                  </Typography>
                  <Typography variant="h5" component="div">
                    {metrics.totalMessages}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Response Rate
                  </Typography>
                  <Typography variant="h5" component="div">
                    {metrics.responseRate.toFixed(1)}%
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h5" component="div">
                    {metrics.conversionRate.toFixed(1)}%
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Conversions
                  </Typography>
                  <Typography variant="h5" component="div">
                    {metrics.totalConversions}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Performance Timeline
          </Typography>
          <Card>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export { CampaignAnalytics };
