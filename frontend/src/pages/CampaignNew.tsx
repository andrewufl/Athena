import React from 'react';
import { Box, Grid, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Stepper, Step, StepLabel, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const steps = ['Basic Info', 'Message Content', 'Scheduling'];

const CampaignNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    workspaceId: '',
    channel: '',
    message: '',
    tone: 'professional',
    schedule: 'immediate',
    startTime: '',
    endTime: '',
    error: '',
  });

  const handleNext = () => {
    if (activeStep === 0 && !formData.name) {
      setFormData({ ...formData, error: 'Please enter a campaign name' });
      return;
    }
    if (activeStep === 1 && !formData.message) {
      setFormData({ ...formData, error: 'Please enter a message' });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement API call to create campaign
      navigate('/campaigns');
    } catch (error) {
      setFormData({ ...formData, error: 'Failed to create campaign' });
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Workspace</InputLabel>
              <Select
                value={formData.workspaceId}
                onChange={(e) => handleChange('workspaceId', e.target.value)}
                label="Workspace"
                required
              >
                {/* Workspaces will be populated from API */}
                <MenuItem value="">Select Workspace</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Channel</InputLabel>
              <Select
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                label="Channel"
                required
              >
                {/* Channels will be populated from API */}
                <MenuItem value="">Select Channel</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="Message Content"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tone</InputLabel>
              <Select
                value={formData.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
                label="Tone"
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Schedule</InputLabel>
              <Select
                value={formData.schedule}
                onChange={(e) => handleChange('schedule', e.target.value)}
                label="Schedule"
              >
                <MenuItem value="immediate">Send Immediately</MenuItem>
                <MenuItem value="scheduled">Schedule for Later</MenuItem>
              </Select>
            </FormControl>
            {formData.schedule === 'scheduled' && (
              <>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="End Time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  margin="normal"
                  required
                />
              </>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Campaign
      </Typography>

      {formData.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formData.error}
        </Alert>
      )}

      <Card sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Create Campaign' : 'Next'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export { CampaignNew };
