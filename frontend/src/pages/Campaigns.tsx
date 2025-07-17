import { Box, Grid, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Campaigns = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleWorkspaceChange = (event: any) => {
    setSelectedWorkspace(event.target.value);
  };

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const matchesWorkspace = !selectedWorkspace || campaign.workspaceId === selectedWorkspace;
    const matchesStatus = !selectedStatus || campaign.status === selectedStatus;
    return matchesWorkspace && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campaigns
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleCreateCampaign}
          sx={{ mb: 2 }}
        >
          Create Campaign
        </Button>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Workspace</InputLabel>
            <Select
              value={selectedWorkspace}
              onChange={handleWorkspaceChange}
              label="Workspace"
            >
              <MenuItem value="">All Workspaces</MenuItem>
              {/* Workspace options will be populated from API */}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Workspace</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Messages Sent</TableCell>
                <TableCell>Response Rate</TableCell>
                <TableCell>Conversion Rate</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns.map((campaign: any) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.workspaceName}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: {
                          active: 'success.main',
                          paused: 'warning.main',
                          completed: 'info.main',
                          failed: 'error.main',
                        }[campaign.status],
                        color: 'white',
                      }}
                    >
                      {campaign.status}
                    </Box>
                  </TableCell>
                  <TableCell>{campaign.performance.totalMessages}</TableCell>
                  <TableCell>{campaign.performance.responseRate}%</TableCell>
                  <TableCell>{campaign.performance.conversionRate}%</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export { Campaigns };
