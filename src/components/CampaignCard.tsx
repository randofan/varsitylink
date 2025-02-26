'use client';

import { Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import { Campaign } from '@prisma/client';

export default function CampaignCard(props: Campaign) {
  return (
    <Link
      href={`/business/campaigns/${props.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Card sx={{
        cursor: 'pointer',
        height: '100%',
        '&:hover': {
          boxShadow: 6,
        }
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {props.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Status: {props.status}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Created: {props.createdAt.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Start: {props.startDate.toLocaleString()} | End: {props.endDate.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {props.campaignSummary}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
