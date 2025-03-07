"use client";

import React from 'react';
import { Modal, Box, Typography, IconButton, Grid, Chip, Avatar, Fade, Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import Image from 'next/image';
import { StudentAthlete } from '@prisma/client';

interface StudentAthleteModalProps {
  athlete: StudentAthlete | null;
  open: boolean;
  onClose: () => void;
}

// Helper function to format follower counts (e.g., 1500 -> 1.5K)
const formatFollowerCount = (count: number | null | undefined) => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export default function StudentAthleteModal({ athlete, open, onClose }: StudentAthleteModalProps) {
  if (!athlete) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%' },
          maxWidth: 900,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 3, md: 4 },
        }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={4}>
            {/* Left side - Image and basic info */}
            <Grid item xs={12} md={5}>
              <Box sx={{
                position: 'relative',
                height: { xs: 280, md: 350 },
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3,
                boxShadow: 3
              }}>
                {athlete.image ? (
                  <Image
                    src={athlete.image}
                    alt={athlete.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                ) : (
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography variant="body1" color="text.secondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="h4" gutterBottom fontWeight="bold">
                {athlete.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={athlete.sport}
                  color="primary"
                  sx={{ fontWeight: 'medium' }}
                />
                <Chip
                  label={`${athlete.age} years old`}
                  variant="outlined"
                />
                <Chip
                  label={athlete.gender}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" gutterBottom>
                <strong>Major:</strong> {athlete.major}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Ethnicity:</strong> {athlete.ethnicity}
              </Typography>
            </Grid>

            {/* Right side - Details */}
            <Grid item xs={12} md={7}>
              {athlete.introBlurb && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    About Me
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {athlete.introBlurb}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Social Media Presence
                </Typography>

                <Grid container spacing={2}>
                  {athlete.instagram && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: '#F8F9FA'
                      }}>
                        <Avatar sx={{ bgcolor: '#E1306C' }}>
                          <InstagramIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            Instagram: @{athlete.instagram}
                          </Typography>
                          {athlete.instagramFollowers && (
                            <Typography variant="subtitle2" color="text.secondary">
                              {formatFollowerCount(athlete.instagramFollowers)} followers
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {athlete.tiktok && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: '#F8F9FA'
                      }}>
                        <Avatar sx={{ bgcolor: '#000000' }}>
                          <TikTokIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            TikTok: @{athlete.tiktok}
                          </Typography>
                          {athlete.tiktokFollowers && (
                            <Typography variant="subtitle2" color="text.secondary">
                              {formatFollowerCount(athlete.tiktokFollowers)} followers
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {athlete.twitter && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: '#F8F9FA'
                      }}>
                        <Avatar sx={{ bgcolor: '#1DA1F2' }}>
                          <TwitterIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            Twitter: @{athlete.twitter}
                          </Typography>
                          {athlete.twitterFollowers && (
                            <Typography variant="subtitle2" color="text.secondary">
                              {formatFollowerCount(athlete.twitterFollowers)} followers
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {athlete.linkedIn && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: '#F8F9FA'
                      }}>
                        <Avatar sx={{ bgcolor: '#0A66C2' }}>
                          <LinkedInIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            LinkedIn: {athlete.linkedIn}
                          </Typography>
                          {athlete.linkedInFollowers && (
                            <Typography variant="subtitle2" color="text.secondary">
                              {formatFollowerCount(athlete.linkedInFollowers)} connections
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {athlete.pinterest && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: '#F8F9FA'
                      }}>
                        <Avatar sx={{ bgcolor: '#E60023' }}>
                          <PinterestIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            Pinterest: {athlete.pinterest}
                          </Typography>
                          {athlete.pinterestFollowers && (
                            <Typography variant="subtitle2" color="text.secondary">
                              {formatFollowerCount(athlete.pinterestFollowers)} followers
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {athlete.industries && athlete.industries.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Preferred Industries
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {athlete.industries.map((industry, index) => (
                      <Chip
                        key={index}
                        label={industry}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {athlete.marketingOptions && athlete.marketingOptions.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Marketing Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {athlete.marketingOptions.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        color="secondary"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {athlete.compensation && athlete.compensation.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Compensation Preferences
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {athlete.compensation.map((comp, index) => (
                      <Chip
                        key={index}
                        label={comp}
                        color="info"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {athlete.hoursPerWeek && (
                <Typography variant="body1" gutterBottom>
                  <strong>Available Hours Per Week:</strong> {athlete.hoursPerWeek} hours
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
}
