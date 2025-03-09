import { useState, useEffect } from 'react';
import { Campaign } from '@/utils/types';

export function useCampaigns(businessId?: number) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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