"use client";

import Image from 'next/image';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
}: StudentAthlete) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '8px',
        minHeight: '400px',
      }}
    >
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

        {instagram && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <InstagramIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">@{instagram}</Typography>
          </Box>
        )}

        {tiktok && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <TikTokIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">@{tiktok}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
