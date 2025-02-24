import { Campaign } from '@prisma/client';

export const campaigns = [
    {
        id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        name: 'Spring Sale',
        status: 'active',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-05-31'),
        createdAt: new Date('2023-02-15'),
        campaignSummary: 'A spring sale to increase sales by 20%.'
    },
    {
        id: 'p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1',
        name: 'Summer Sale',
        status: 'inactive',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-08-31'),
        createdAt: new Date('2023-05-15'),
        campaignSummary: 'A summer sale to increase sales by 20%.'
    },
    {
        id: 'dfsdgn4m3l2k1j09h8g7f6e5d4c3b2a1',
        name: 'Fall Sale',
        status: 'active',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-11-30'),
        createdAt: new Date('2023-08-15'),
        campaignSummary: 'A fall sale to increase sales by 20%.'
    },
    {
        id: 'olneoien4mdfsjkdfsroifsg7f6e5da1',
        name: 'Winter Sale',
        status: 'inactive',
        startDate: new Date('2023-12-01'),
        endDate: new Date('2024-02-28'),
        createdAt: new Date('2023-11-15'),
        campaignSummary: 'A winter sale to increase sales by 20%.'
    }
] as Campaign[];