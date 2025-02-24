import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export interface CampaignCardProps {
  id: string;
  name: string;
  status: string;
  dateCreated: string;
  startDate: string;
  endDate: string;
  summary: string;
}

export default function CampaignCard({
  id,
  name,
  status,
  dateCreated,
  startDate,
  endDate,
  summary,
}: CampaignCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/business/campaigns/${id}`);
  };

  return (
    <Card onClick={handleClick} sx={{ cursor: 'pointer', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Status: {status}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {dateCreated}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Start: {startDate} | End: {endDate}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {summary}
        </Typography>
      </CardContent>
    </Card>
  );
}
