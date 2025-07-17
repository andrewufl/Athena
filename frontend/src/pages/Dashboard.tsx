import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert, ListItem, ListItemText, ListItemAvatar, Avatar, List, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

interface Campaign {
  _id: string;
  name: string;
  status: string;
  messageCount: number;
}

interface Workspace {
  _id: string;
  name: string;
  status: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalMessages: number;
  conversionRate: number;
}

interface Campaign {
  _id: string;
  name: string;
  status: string;
  messageCount: number;
}

interface Workspace {
  _id: string;
  name: string;
  status: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<DashboardState>({
    stats: null,
    loading: true,
    error: null,
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [activeWorkspaces, setActiveWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, recentCampaigns, activeWorkspaces] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentCampaigns(),
          dashboardService.getActiveWorkspaces(),
        ]);
        setState({
          stats,
          loading: false,
          error: null,
        });
        setRecentCampaigns(recentCampaigns);
        setActiveWorkspaces(activeWorkspaces);
      } catch (error) {
        setState({
          stats: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}
      {state.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Campaigns
                  </Typography>
                  <Typography variant="h4" align="center">
                    {state.stats?.totalCampaigns}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Campaigns
                  </Typography>
                  <Typography variant="h4" align="center">
                    {state.stats?.activeCampaigns}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Messages
                  </Typography>
                  <Typography variant="h4" align="center">
                    {state.stats?.totalMessages}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" align="center">
                    {state.stats?.conversionRate.toFixed(1)}%
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Recent Campaigns
                  </Typography>
                  <List>
                    {recentCampaigns.map((campaign) => (
                      <ListItem
                        key={campaign._id}
                        button
                        onClick={() => navigate(`/campaigns/${campaign._id}/analytics`)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {campaign.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={campaign.name}
                          secondary={`Status: ${campaign.status} • ${campaign.messageCount} messages`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Active Workspaces
                  </Typography>
                  <List>
                    {activeWorkspaces.map((workspace) => (
                      <ListItem key={workspace._id}>
                        <ListItemAvatar>
                          <Avatar>
                            {workspace.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={workspace.name}
                          secondary={workspace.status}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/campaigns/new')}
                    sx={{ mb: 2 }}
                  >
                    Create Campaign
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/workspaces')}
                    sx={{ mb: 2 }}
                  >
                    Manage Workspaces
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/settings')}
                  >
                    Settings
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export { Dashboard };
