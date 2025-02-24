import { campaigns } from '@/utils/campaigns';
import { Campaign } from '@prisma/client';

export default async function BusinessPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const campaign = campaigns.find((campaign: Campaign) => campaign.id === id);

    return (
        <div style={{ padding: '16px' }}>
            {campaign ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{campaign.name}</h1>
                <p style={{ color: '#666666' }}>{campaign.campaignSummary}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                    <p style={{ fontWeight: '600' }}>Budget:</p>
                    <p>${campaign.budget}</p>
                </div>
                <div>
                    <p style={{ fontWeight: '600' }}>Status:</p>
                    <p>{campaign.status}</p>
                </div>
                <div>
                    <p style={{ fontWeight: '600' }}>Start Date:</p>
                    <p>{campaign.startDate?.toLocaleDateString()}</p>
                </div>
                <div>
                    <p style={{ fontWeight: '600' }}>End Date:</p>
                    <p>{campaign.endDate?.toLocaleDateString()}</p>
                </div>
                </div>
            </div>
            ) : (
            <p>Campaign not found</p>
            )}
        </div>
    );
}
