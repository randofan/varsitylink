'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Card, CardContent, CircularProgress } from '@mui/material';

interface StudentAthlete {
  id: number;
  name: string;
  email: string;
  image?: string;
  age: number;
  sport: string;
  major: string;
  gender: string;
  ethnicity: string;
  introBlurb?: string;
  instagram?: string;
  tiktok?: string;
  pinterest?: string;
  linkedIn?: string;
  twitter?: string;
  industries: string[];
  marketingOptions: string[];
  hoursPerWeek?: number;
  compensation: string[];
}

export default function StudentAthleteProfile() {
  const [athlete, setAthlete] = useState<StudentAthlete | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchAthlete = async () => {
        try {
          const response = await fetch(`/api/student/student-athlete?id=${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch athlete data');
          }
          const data = await response.json();
          setAthlete(data);
        } catch (error) {
          console.error('Error fetching athlete data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAthlete();
    }
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!athlete) {
    return <Typography variant="h6">Athlete not found</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {athlete.name}
        </Typography>
        <Typography variant="body1">Email: {athlete.email}</Typography>
        <Typography variant="body1">Sport: {athlete.sport}</Typography>
        <Typography variant="body1">Age: {athlete.age}</Typography>
        <Typography variant="body1">Major: {athlete.major}</Typography>
        <Typography variant="body1">Gender: {athlete.gender}</Typography>
        <Typography variant="body1">Ethnicity: {athlete.ethnicity}</Typography>
        <Typography variant="body1">Introduction: {athlete.introBlurb}</Typography>
        <Typography variant="body1">Instagram: {athlete.instagram}</Typography>
        <Typography variant="body1">TikTok: {athlete.tiktok}</Typography>
        <Typography variant="body1">Pinterest: {athlete.pinterest}</Typography>
        <Typography variant="body1">LinkedIn: {athlete.linkedIn}</Typography>
        <Typography variant="body1">Twitter: {athlete.twitter}</Typography>
        <Typography variant="body1">Industries: {athlete.industries.join(', ')}</Typography>
        <Typography variant="body1">Marketing Options: {athlete.marketingOptions.join(', ')}</Typography>
        <Typography variant="body1">Hours Per Week: {athlete.hoursPerWeek}</Typography>
        <Typography variant="body1">Compensation: {athlete.compensation.join(', ')}</Typography>
      </CardContent>
    </Card>
  );
}