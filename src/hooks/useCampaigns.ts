import { useState, useEffect } from 'react';
import { Campaign, Business, StudentAthlete } from '@prisma/client';

interface CampaignWithRelations extends Campaign {
  business: Business;
  studentAthletes: StudentAthlete[];
}

export function useCampaigns(businessId?: number) {
  const [campaigns, setCampaigns] = useState<CampaignWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const url = businessId
          ? `/api/campaign?businessId=${businessId}`
          : '/api/campaign';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [businessId]);

  return { campaigns, loading, error };
}