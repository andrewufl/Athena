import React from 'react';
import { Box, Grid, Typography, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = React.useState({
    apiEndpoint: '',
    defaultWorkspace: '',
    autoResponse: true,
    tone: 'professional',
    timezone: 'UTC',
    error: '',
  });

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save settings
      navigate('/');
    } catch (error) {
      setSettings({ ...settings, error: 'Failed to save settings' });
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {settings.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {settings.error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              API Configuration
            </Typography>
            <TextField
              fullWidth
              label="API Endpoint"
              value={settings.apiEndpoint}
              onChange={(e) => handleChange('apiEndpoint', e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Default Workspace</InputLabel>
              <Select
                value={settings.defaultWorkspace}
                onChange={(e) => handleChange('defaultWorkspace', e.target.value)}
                label="Default Workspace"
              >
                {/* Workspaces will be populated from API */}
                <MenuItem value="">Select Default Workspace</MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              AI Settings
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tone</InputLabel>
              <Select
                value={settings.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
                label="Tone"
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                label="Timezone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Auto-Response Settings
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Auto-Response</InputLabel>
              <Select
                value={settings.autoResponse ? 'enabled' : 'disabled'}
                onChange={(e) => handleChange('autoResponse', e.target.value === 'enabled')}
                label="Auto-Response"
              >
                <MenuItem value="enabled">Enabled</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ mt: 3 }}
          >
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export { Settings };
