import { useState, useEffect } from 'react';
import { StudentAthlete } from '@prisma/client';

export function useAthletes(sport?: string) {
  const [athletes, setAthletes] = useState<StudentAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const url = sport
          ? `/api/student-athlete?sport=${encodeURIComponent(sport)}`
          : '/api/student-athlete';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch athletes');
        const data = await response.json();
        setAthletes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch athletes');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [sport]);

  return { athletes, loading, error };
}
