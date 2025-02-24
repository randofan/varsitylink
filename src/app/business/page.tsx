'use client';

import React from 'react';
import { Container, Grid2, Typography } from '@mui/material';
import BusinessHeader from '@/components/BusinessHeader';
import CampaignCard, { CampaignCardProps } from '@/components/CampaignCard';

const campaigns: CampaignCardProps[] = [
    {
        id: '1',
        name: 'Campaign One',
        status: 'Active',
        dateCreated: '2023-09-01',
        startDate: '2023-09-05',
        endDate: '2023-10-05',
        summary: 'A short summary of Campaign One.',
    },
    {
        id: '2',
        name: 'Campaign Two',
        status: 'Draft',
        dateCreated: '2023-08-15',
        startDate: '2023-09-01',
        endDate: '2023-11-01',
        summary: 'A short summary of Campaign Two.',
    },
    // ...more campaign objects as needed...
];

export default function CampaignsPage() {
    return (
        <>
            <BusinessHeader />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Your Campaigns
                </Typography>
                <Grid2 container spacing={2}>
                    {campaigns.map((campaign) => (
                        <Grid2 xs={12} sm={6} md={4} key={campaign.id}>
                            <CampaignCard {...campaign} />
                        </Grid2>
                    ))}
                </Grid2>
            </Container>
        </>
    );
}
