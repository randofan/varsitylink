import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
interface StudentAthlete {
  id: number | string;  // Accept both number and string
  name: string;
  sport?: string;
  image?: string | null;
}

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  athletes: StudentAthlete[];
  campaignName: string;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ open, onClose, athletes, campaignName }) => {
  const [message, setMessage] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<StudentAthlete | null>(null);
  
  // Mock conversation history
  const [conversations, setConversations] = useState<Record<string, Array<{text: string, fromBusiness: boolean, timestamp: Date}>>>({});

  const handleSend = () => {
    if (!message.trim() || !selectedAthlete) return;
    
    // Add message to conversation history
    const athleteId = String(selectedAthlete.id);  // Convert ID to string for use as object key
    const newMessage = { text: message, fromBusiness: true, timestamp: new Date() };
    
    setConversations(prev => ({
      ...prev,
      [athleteId]: [...(prev[athleteId] || []), newMessage]
    }));
    
    // Clear input
    setMessage('');
    
    // Simulate response (optional)
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'll review the campaign details.",
        "Got it, sounds good. When do we start?",
        "I'm excited to be part of this campaign.",
        "Can you provide more details about the content requirements?"
      ];
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      
      setConversations(prev => ({
        ...prev,
        [athleteId]: [...(prev[athleteId] || []), {
          text: responseText,
          fromBusiness: false,
          timestamp: new Date()
        }]
      }));
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAthleteSelect = (athlete: StudentAthlete) => {
    setSelectedAthlete(athlete);
    
    // Initialize conversation if it doesn't exist
    const athleteId = String(athlete.id);  // Convert ID to string for use as object key
    if (!conversations[athleteId]) {
      setConversations(prev => ({
        ...prev,
        [athleteId]: []
      }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '700px',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle 
        component="div"
        sx={{ 
          bgcolor: '#4767F5', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2
        }}
      >
        <Typography 
          variant="subtitle1"
          component="div" 
          fontWeight="medium"
        >
          {selectedAthlete ? `Message: ${selectedAthlete.name}` : 'Message Athletes'}
        </Typography>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Left sidebar - Athletes list */}
        <Box sx={{ 
          width: '250px', 
          borderRight: '1px solid #eee', 
          overflowY: 'auto',
          height: '100%'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {campaignName}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {athletes.length} Athletes
            </Typography>
          </Box>
          
          <List sx={{ p: 0 }}>
            {athletes.map((athlete) => (
              <ListItem 
                component="div"
                key={athlete.id}
                disablePadding
              >
                <ListItemButton
                  onClick={() => handleAthleteSelect(athlete)}
                  selected={selectedAthlete?.id === athlete.id}
                  sx={{
                    py: 2,
                    borderBottom: '1px solid #f5f5f5',
                    bgcolor: selectedAthlete?.id === athlete.id ? '#f0f4ff' : 'transparent',
                    '&:hover': {
                      bgcolor: '#f8faff'
                    }
                  }}
                >
                <ListItemAvatar>
                  <Avatar 
                    src={athlete.image || undefined}
                    alt={athlete.name || ''}
                    sx={{ bgcolor: '#4767F5' }}
                  >
                    {athlete.name?.[0] || ''}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={athlete.name || ''}
                  secondary={athlete.sport || ''}
                  primaryTypographyProps={{
                    fontWeight: 'medium',
                    variant: 'body2'
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption'
                  }}
                />
                              </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Right side - Conversation area */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          bgcolor: '#f9f9f9'
        }}>
          {selectedAthlete ? (
            <>
              {/* Messages area */}
              <Box sx={{ 
                flexGrow: 1, 
                p: 2, 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Welcome message if no messages yet */}
                {(!conversations[selectedAthlete.id] || conversations[selectedAthlete.id].length === 0) && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 4,
                    p: 3, 
                    bgcolor: 'white',
                    borderRadius: 2,
                    mx: 'auto',
                    maxWidth: '70%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Start Messaging {selectedAthlete.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is the beginning of your conversation for the campaign "{campaignName}".
                    </Typography>
                  </Box>
                )}
                
                {/* Message bubbles */}
                {conversations[selectedAthlete.id]?.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      alignSelf: msg.fromBusiness ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      mb: 2
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: msg.fromBusiness ? '#4767F5' : 'white',
                        color: msg.fromBusiness ? 'white' : 'inherit',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Paper>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 0.5, 
                        ml: msg.fromBusiness ? 0 : 2,
                        mr: msg.fromBusiness ? 2 : 0,
                        textAlign: msg.fromBusiness ? 'right' : 'left',
                        color: 'text.secondary'
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {/* Message input area */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'white', 
                borderTop: '1px solid #eee',
                display: 'flex',
                alignItems: 'center'
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  size="small"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton size="small" color="primary">
                          <EmojiIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" color="primary">
                          <AttachFileIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!message.trim()}
                  onClick={handleSend}
                  sx={{
                    ml: 1,
                    borderRadius: 4,
                    px: 3,
                    minWidth: '100px'
                  }}
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              </Box>
            </>
          ) : (
            // No athlete selected state
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              flexDirection: 'column',
              p: 4
            }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#EEF2FF', color: '#4767F5', mb: 3 }}>
                <SendIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Select an athlete to start messaging
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                You can send messages to athletes in your campaign. Select an athlete from the list to start a conversation.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;