'use client';

import { Box, Container, Typography } from '@mui/material';
import CampaignCard from '@/components/CampaignCard';
import BusinessHeader from '@/components/BusinessHeader';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function CampaignsPage() {
  const { campaigns, loading, error } = useCampaigns(1);

  if (error) {
    return (
      <>
        <BusinessHeader />
        <Container sx={{ mt: 4 }}>
          <Typography color="error">Error: {error}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <BusinessHeader />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Your Campaigns
        </Typography>
        {loading ? (
          <Typography>Loading campaigns...</Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
