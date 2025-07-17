import { Box, Grid, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';
import { useState } from 'react';
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

const Workspaces = () => {
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const filteredWorkspaces = workspaces.filter((workspace: any) => {
    return !statusFilter || workspace.status === statusFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Workspaces
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
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
                <TableCell>Status</TableCell>
                <TableCell>Channels</TableCell>
                <TableCell>Active Campaigns</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkspaces.map((workspace: any) => (
                <TableRow key={workspace.id}>
                  <TableCell>{workspace.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: {
                          active: 'success.main',
                          inactive: 'error.main',
                        }[workspace.status],
                        color: 'white',
                      }}
                    >
                      {workspace.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {workspace.channels.map((channel: any) => (
                        <Chip
                          key={channel.id}
                          label={channel.name}
                          size="small"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{workspace.activeCampaigns}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/workspaces/${workspace.id}`)}
                    >
                      Manage
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

export { Workspaces };
