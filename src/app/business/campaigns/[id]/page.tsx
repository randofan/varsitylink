"use client";

import StudentAthleteCard from '@/components/StudentAthleteCard';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Alert,
    LinearProgress,
    Tab,
    Tabs
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    Event as EventIcon,
    Group as GroupIcon,
    BarChart as BarChartIcon,
    AttachMoney as MoneyIcon,
    SportsBasketball as SportsIcon
} from '@mui/icons-material';
import { StudentAthlete } from '@prisma/client';

// Type for the Campaign from the SignupWizard
interface Campaign {
    id: string;
    name: string;
    campaignSummary: string;
    maxBudget: string;
    compensation: string;
    studentAthleteCount: string;
    sports: string[];
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    businessId: number;
    studentAthletes: StudentAthlete[];
    contentGuidelines?: string;
    objectives?: string;
    metrics?: string;
    executiveSummary?: string;
}

export default function CampaignDashboard() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchCampaign = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/campaign/${id}`);
                if (!response.ok) throw new Error('Failed to fetch campaign data');
                const data = await response.json();
                setCampaign(data);
            } catch (err) {
                console.error('Error fetching campaign:', err);
                setError('Unable to load campaign data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Calculate days remaining in the campaign
    const calculateDaysRemaining = () => {
        if (!campaign) return 0;

        const endDate = new Date(campaign.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    };

    // Calculate campaign progress percentage
    const calculateProgress = () => {
        if (!campaign) return 0;

        const startDate = new Date(campaign.startDate);
        const endDate = new Date(campaign.endDate);
        const today = new Date();

        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = today.getTime() - startDate.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) return 100;

        return Math.round((elapsed / totalDuration) * 100);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !campaign) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">{error || 'Campaign not found'}</Alert>
            </Box>
        );
    }

    const progress = calculateProgress();
    const daysRemaining = calculateDaysRemaining();

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Campaign header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, #4767F5, #6E8AFF)',
                    color: 'white'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {campaign.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                            {campaign.campaignSummary}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip
                                icon={<EventIcon sx={{ color: 'white !important' }} />}
                                label={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                            />
                            <Chip
                                icon={<GroupIcon sx={{ color: 'white !important' }} />}
                                label={`${campaign.studentAthletes.length} Athletes`}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                            <Chip
                                icon={<MoneyIcon sx={{ color: 'white !important' }} />}
                                label={`Budget: ${campaign.maxBudget}`}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Campaign Progress
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: 'white'
                                    }
                                }}
                            />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {progress}% Complete • {daysRemaining} Days Remaining
                            </Typography>
                            <Chip
                                label={campaign.status}
                                sx={{
                                    mt: 2,
                                    bgcolor: campaign.status === 'ACTIVE' ? '#4CAF50' :
                                        campaign.status === 'PENDING' ? '#FF9800' :
                                            campaign.status === 'COMPLETED' ? '#9E9E9E' : '#F44336',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="campaign dashboard tabs">
                    <Tab label="Overview" icon={<CampaignIcon />} iconPosition="start" />
                    <Tab label="Athletes" icon={<SportsIcon />} iconPosition="start" />
                    <Tab label="Analytics" icon={<BarChartIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* Tab content */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {/* Campaign details */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <CampaignIcon sx={{ mr: 1, color: '#4767F5' }} />
                                Campaign Details
                            </Typography>

                            <Grid container spacing={3}>
                                {campaign.objectives && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                            Objectives
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            {campaign.objectives}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                    </Grid>
                                )}

                                {campaign.contentGuidelines && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                            Content Guidelines
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            {campaign.contentGuidelines}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                    </Grid>
                                )}

                                {campaign.metrics && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                            Success Metrics
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            {campaign.metrics}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                        Compensation
                                    </Typography>
                                    <Typography variant="body2">
                                        Type: {campaign.compensation}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Budget: {campaign.maxBudget}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                        Timeline
                                    </Typography>
                                    <Typography variant="body2">
                                        Start: {formatDate(campaign.startDate)}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        End: {formatDate(campaign.endDate)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                        Sports
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {campaign.sports.map((sport) => (
                                            <Chip
                                                key={sport}
                                                label={sport}
                                                size="small"
                                                sx={{ bgcolor: '#EEF2FF', color: '#4767F5' }}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Campaign stats */}
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <GroupIcon sx={{ mr: 1, color: '#4767F5' }} />
                                        Athlete Stats
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Total Athletes
                                            </Typography>
                                            <Typography variant="h4">
                                                {campaign.studentAthletes.length}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Total Reach
                                            </Typography>
                                            <Typography variant="h4">
                                                {campaign.studentAthletes.reduce((sum, athlete) => {
                                                    // Using instagram followers count if available, otherwise default to 0
                                                    return sum + (athlete.instagram ? 10000 : 0) + (athlete.tiktok ? 15000 : 0);
                                                }, 0).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Sports Coverage
                                            </Typography>
                                            <Typography variant="h4">
                                                {new Set(campaign.studentAthletes.map(a => a.sport)).size}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <BarChartIcon sx={{ mr: 1, color: '#4767F5' }} />
                                        Quick Actions
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Button variant="outlined" fullWidth>
                                            Message Athletes
                                        </Button>
                                        <Button variant="outlined" fullWidth>
                                            View Analytics
                                        </Button>
                                        <Button variant="outlined" fullWidth>
                                            Export Report
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Campaign Athletes
                    </Typography>

                    <Grid container spacing={3}>
                        {campaign.studentAthletes.map((athlete) => (
                            <Grid item xs={12} sm={6} md={4} key={athlete.id}>
                                <StudentAthleteCard {...athlete} />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 2 }}
                                    fullWidth
                                >
                                    View Profile
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {tabValue === 2 && (
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Campaign Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Analytics data will be available after the campaign starts. Check back soon for performance metrics.
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Planned Posts
                                </Typography>
                                <Typography variant="h4" sx={{ my: 1 }}>
                                    {campaign.studentAthletes.length * 2}
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Estimated Reach
                                </Typography>
                                <Typography variant="h4" sx={{ my: 1 }}>
                                    {campaign.studentAthletes.reduce((sum, athlete) => {
                                        // Using instagram followers count if available, otherwise default to 0
                                        return sum + (athlete.instagram ? 10000 : 0) + (athlete.tiktok ? 15000 : 0);
                                    }, 0).toLocaleString()}
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Days Remaining
                                </Typography>
                                <Typography variant="h4" sx={{ my: 1 }}>
                                    {daysRemaining}
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
}
