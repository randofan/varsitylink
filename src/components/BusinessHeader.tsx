import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Avatar } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Image from 'next/image';
import Link from 'next/link';

export default function BusinessHeader() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/business" passHref>
            <Image src="/small_logo.svg" alt="Logo" width={40} height={40} />
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/business/campaigns/create" passHref>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#4767F5', textTransform: 'none' }}
            >
              + Create Campaign
            </Button>
          </Link>
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
