"use client";

import Image from 'next/image';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote';
import { StudentAthlete } from '@prisma/client';

export default function StudentAthleteCard({
  name,
  image,
  sport,
  age,
  major,
  gender,
  instagram,
  tiktok,
  instagramFollowers,
  tiktokFollowers,
  isClickable = false,
}: StudentAthlete & { isClickable?: boolean }) {
  // Helper function to format follower counts (e.g., 1500 -> 1.5K)
  const formatFollowerCount = (count: number | null | undefined) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '8px',
        minHeight: '400px',
        transition: 'box-shadow 0.2s',
        position: 'relative',
        ...(isClickable && {
          '&:hover': {
            boxShadow: 4,
          },
        }),
      }}
    >
      {/* Clickable indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 1,
          zIndex: 1,
        }}
      >
        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
          i
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', height: '256px', width: '100%' }}>
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {sport}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Age: {age}
        </Typography>
        <Typography variant="body2">
          Major: {major}
        </Typography>
        <Typography variant="body2">
          Gender: {gender}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Social Media
          </Typography>

          {instagram && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InstagramIcon fontSize="small" sx={{ color: '#E1306C' }} />
              <Typography variant="body2">@{instagram}</Typography>
              {instagramFollowers && (
                <Chip
                  size="small"
                  label={`${formatFollowerCount(instagramFollowers)} followers`}
                  sx={{
                    fontSize: '0.7rem',
                    height: '20px',
                    backgroundColor: '#E1306C',
                    color: 'white'
                  }}
                />
              )}
            </Box>
          )}

          {tiktok && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TikTokIcon fontSize="small" sx={{ color: '#000000' }} />
              <Typography variant="body2">@{tiktok}</Typography>
              {tiktokFollowers && (
                <Chip
                  size="small"
                  label={`${formatFollowerCount(tiktokFollowers)} followers`}
                  sx={{
                    fontSize: '0.7rem',
                    height: '20px',
                    backgroundColor: '#000000',
                    color: 'white'
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
