import { Box, Container } from '@mui/material';
import CampaignCard from '@/components/CampaignCard';
import BusinessHeader from '@/components/BusinessHeader';
import { Campaign } from '@prisma/client';

export default function Dashboard({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <>
      <BusinessHeader />
      <Container sx={{ mt: 4 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          p: 2
        }}>
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
            />
          ))}
        </Box>
      </Container>
    </>
  );
}
