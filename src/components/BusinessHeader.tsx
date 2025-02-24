import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Avatar } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BusinessHeader() {
  const router = useRouter();

  const handleCreateCampaign = () => {
    router.push('/business/campaigns/create');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Image src="/small_logo.svg" alt="Logo" width={40} height={40} />
          <Button
            variant="contained"
            onClick={handleCreateCampaign}
            sx={{ backgroundColor: '#4767F5', textTransform: 'none' }}
          >
            + Create Campaign
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <MailIcon />
          </IconButton>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <IconButton>
            <Avatar alt="Profile" src="/profile.jpg" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
