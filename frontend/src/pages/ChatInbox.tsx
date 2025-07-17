import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { chatService } from '../services/chatService';
import { Message, Conversation } from '../types/chat';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const ChatInbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error('Chat inbox error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Live Chat Inbox
      </Typography>
      
      <Grid container spacing={3}>
        {conversations.map((conversation) => (
          <Grid item xs={12} md={6} lg={4} key={conversation.id}>
            <StyledCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ListItemAvatar>
                    <Avatar src={conversation.user.avatar}>
                      {conversation.user.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.user.name}
                    secondary={conversation.lastMessage.content}
                  />
                  <Box ml="auto">
                    <Typography variant="caption" color="textSecondary">
                      {new Date(conversation.lastMessage.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  {conversation.workspace.name}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status: {conversation.status}
                </Typography>
                
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton onClick={() => navigate(`/chat/${conversation.id}`)}>
                    <i className="fas fa-chevron-right" />
                  </IconButton>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export { ChatInbox };
