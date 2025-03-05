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
    CardContent,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Alert,
    LinearProgress,
    Tab,
    Tabs,
    Avatar,
    Stack
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    Event as EventIcon,
    Group as GroupIcon,
    BarChart as BarChartIcon,
    AttachMoney as MoneyIcon,
    SportsBasketball as SportsIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Visibility as VisibilityIcon,
    Send as SendIcon,
    Download as DownloadIcon,
    Mail as MailIcon
} from '@mui/icons-material';
import { StudentAthlete } from '@prisma/client';
import MessageDialog from '@/components/MessageDialog';

// Define Campaign type to fix TypeScript errors
interface Campaign {
    id: string;
    name: string;
    campaignSummary: string;
    maxBudget: string;
    compensation: string;
    studentAthleteCount: number;
    sports: string[];
    startDate: string;
    endDate: string;
    status: string;
    objectives?: string;
    metrics?: string;
    contentGuidelines?: string;
    brandTone?: string;
    influencerAngle?: string;
    brandMentions?: string;
    aiSummary?: string;
    athleteIntegration?: string;
    channels?: string;
    timeline?: string;
    budgetBreakdown?: string;
    creativeConcept?: string;
    studentAthletes: StudentAthlete[];
}

export default function CampaignDashboard() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [messageDialogOpen, setMessageDialogOpen] = useState(false); // Add state for message dialog

    useEffect(() => {
        const fetchCampaign = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/campaign?id=${id}&businessId=1`);
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

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenMessageDialog = () => {
        setMessageDialogOpen(true);
    };

    const handleCloseMessageDialog = () => {
        setMessageDialogOpen(false);
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

    // Status color mapping
    type StatusType = 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'DRAFT';
    const getStatusColor = (status: string) => {
        const statusColors: Record<StatusType, string> = {
            'ACTIVE': '#4CAF50',
            'PENDING': '#FF9800',
            'COMPLETED': '#9E9E9E',
            'CANCELLED': '#F44336',
            'DRAFT': '#607D8B'
        };
        return statusColors[status as StatusType] || '#757575';
    };

    // Get estimated reach
    const getEstimatedReach = () => {
        if (!campaign) return 0;
        return campaign.studentAthletes.reduce((sum, athlete) => {
            // Using instagram/tiktok as a proxy for followers
            return sum + (athlete.instagram ? 10000 : 0) + (athlete.tiktok ? 15000 : 0);
        }, 0);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#4767F5' }} />
            </Box>
        );
    }

    if (error || !campaign) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ borderRadius: 2, fontWeight: 'medium' }}
                >
                    {error || 'Campaign not found'}
                </Alert>
            </Box>
        );
    }

    const progress = calculateProgress();
    const daysRemaining = calculateDaysRemaining();
    const estimatedReach = getEstimatedReach();

    // Render info section
    const renderInfoSection = (title: string, content?: string) => {
        if (!content) return null;

        return (
            <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" fontWeight="medium" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {content}
                </Typography>
                <Divider sx={{ my: 2 }} />
            </Grid>
        );
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Message Dialog */}
            {campaign && (
                <MessageDialog
                    open={messageDialogOpen}
                    onClose={handleCloseMessageDialog}
                    athletes={campaign.studentAthletes}
                    campaignName={campaign.name}
                />
            )}

            {/* Campaign header */}
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4767F5, #6E8AFF)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background decorative element */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        zIndex: 0
                    }}
                />

                <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            <CampaignIcon sx={{ mr: 1.5, fontSize: 32 }} />
                            {campaign.name}
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: '95%' }}>
                            {campaign.campaignSummary}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                            <Chip
                                icon={<EventIcon sx={{ color: 'white !important' }} />}
                                label={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                            />
                            <Chip
                                icon={<GroupIcon sx={{ color: 'white !important' }} />}
                                label={`${campaign.studentAthletes.length} Athletes`}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}
                            />
                            <Chip
                                icon={<MoneyIcon sx={{ color: 'white !important' }} />}
                                label={`Budget: ${campaign.maxBudget}`}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}
                            />
                            <Chip
                                icon={<SportsIcon sx={{ color: 'white !important' }} />}
                                label={campaign.sports.join(', ')}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 1 }}>
                                <ScheduleIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" fontWeight="medium">
                                    Campaign Progress
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: 'white',
                                        borderRadius: 6
                                    },
                                    mb: 1
                                }}
                            />

                            <Typography variant="body2" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                <CheckCircleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                                {progress}% Complete • {daysRemaining} Days Remaining
                            </Typography>

                            <Chip
                                label={campaign.status}
                                sx={{
                                    bgcolor: getStatusColor(campaign.status),
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 1,
                                    border: '2px solid rgba(255,255,255,0.3)'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs navigation */}
            <Paper sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    aria-label="campaign dashboard tabs"
                    sx={{
                        bgcolor: '#f5f7ff',
                        '& .MuiTab-root': { py: 2 },
                        '& .Mui-selected': { color: '#4767F5', fontWeight: 'bold' },
                        '& .MuiTabs-indicator': { bgcolor: '#4767F5', height: 3 }
                    }}
                >
                    <Tab
                        label="Overview"
                        icon={<CampaignIcon />}
                        iconPosition="start"
                        sx={{ textTransform: 'none', fontSize: '1rem' }}
                    />
                    <Tab
                        label="Athletes"
                        icon={<SportsIcon />}
                        iconPosition="start"
                        sx={{ textTransform: 'none', fontSize: '1rem' }}
                    />
                    <Tab
                        label="Analytics"
                        icon={<BarChartIcon />}
                        iconPosition="start"
                        sx={{ textTransform: 'none', fontSize: '1rem' }}
                    />
                </Tabs>
            </Paper>

            {/* Tab content */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {/* Campaign details */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 2, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', pb: 2, borderBottom: '1px solid #eee' }}>
                                <CampaignIcon sx={{ mr: 1, color: '#4767F5' }} />
                                Campaign Details
                            </Typography>

                            <Grid container spacing={3}>
                                {renderInfoSection('Objectives', campaign.objectives)}
                                {renderInfoSection('Brand Tone', campaign.brandTone)}
                                {renderInfoSection('Athlete Integration', campaign.athleteIntegration)}
                                {renderInfoSection('Influencer Angle', campaign.influencerAngle)}
                                {renderInfoSection('Brand Mentions', campaign.brandMentions)}
                                {renderInfoSection('Creative Concept', campaign.creativeConcept)}
                                {renderInfoSection('Content Guidelines', campaign.contentGuidelines)}
                                {renderInfoSection('Success Metrics', campaign.metrics)}
                                {renderInfoSection('Timeline', campaign.timeline)}
                                {renderInfoSection('Channel Strategy', campaign.channels)}
                                {renderInfoSection('Budget Breakdown', campaign.budgetBreakdown)}

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
                                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', pb: 2, borderBottom: '1px solid #eee' }}>
                                        <GroupIcon sx={{ mr: 1, color: '#4767F5' }} />
                                        Campaign Stats
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card sx={{ bgcolor: '#f8f9ff', border: '1px solid #edf0ff' }}>
                                                <CardContent>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Total Athletes
                                                    </Typography>
                                                    <Typography variant="h4" color="#4767F5" fontWeight="bold">
                                                        {campaign.studentAthletes.length}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card sx={{ bgcolor: '#f8f9ff', border: '1px solid #edf0ff' }}>
                                                <CardContent>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Estimated Reach
                                                    </Typography>
                                                    <Typography variant="h4" color="#4767F5" fontWeight="bold">
                                                        {estimatedReach.toLocaleString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card sx={{ bgcolor: '#f8f9ff', border: '1px solid #edf0ff' }}>
                                                <CardContent>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Sports Coverage
                                                    </Typography>
                                                    <Typography variant="h4" color="#4767F5" fontWeight="bold">
                                                        {new Set(campaign.studentAthletes.map(a => a.sport)).size}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', pb: 2, borderBottom: '1px solid #eee' }}>
                                        <BarChartIcon sx={{ mr: 1, color: '#4767F5' }} />
                                        Quick Actions
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SendIcon />}
                                            sx={{
                                                bgcolor: '#4767F5',
                                                '&:hover': { bgcolor: '#3852c4' },
                                                textTransform: 'none'
                                            }}
                                            onClick={handleOpenMessageDialog}
                                        >
                                            Message Athletes
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            sx={{
                                                color: '#4767F5',
                                                borderColor: '#4767F5',
                                                '&:hover': { borderColor: '#3852c4' },
                                                textTransform: 'none'
                                            }}
                                        >
                                            View Analytics
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            sx={{
                                                color: '#4767F5',
                                                borderColor: '#4767F5',
                                                '&:hover': { borderColor: '#3852c4' },
                                                textTransform: 'none'
                                            }}
                                        >
                                            Export Report
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', pb: 2, borderBottom: '1px solid #eee' }}>
                        <SportsIcon sx={{ mr: 1, color: '#4767F5' }} />
                        Campaign Athletes
                    </Typography>

                    <Grid container spacing={3}>
                        {campaign.studentAthletes.map((athlete) => (
                            <Grid item xs={12} sm={6} md={4} key={athlete.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <StudentAthleteCard {...athlete} />
                                    <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            startIcon={<VisibilityIcon />}
                                            sx={{
                                                mt: 2,
                                                bgcolor: '#4767F5',
                                                '&:hover': { bgcolor: '#3852c4' },
                                                textTransform: 'none'
                                            }}
                                            fullWidth
                                        >
                                            View Profile
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            startIcon={<MailIcon />}
                                            sx={{
                                                mt: 1,
                                                color: '#4767F5',
                                                borderColor: '#4767F5',
                                                '&:hover': { borderColor: '#3852c4' },
                                                textTransform: 'none'
                                            }}
                                            onClick={handleOpenMessageDialog}
                                            fullWidth
                                        >
                                            Message
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {tabValue === 2 && (
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', pb: 2, borderBottom: '1px solid #eee' }}>
                        <BarChartIcon sx={{ mr: 1, color: '#4767F5' }} />
                        Campaign Analytics
                    </Typography>

                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9ff', borderRadius: 2, mb: 3 }}>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Analytics data will be available after the campaign starts. Check back soon for performance metrics.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4767F5', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                        <CampaignIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Planned Posts
                                    </Typography>
                                    <Typography variant="h3" sx={{ my: 1, color: '#4767F5', fontWeight: 'bold' }}>
                                        {campaign.studentAthletes.length * 2}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4767F5', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                        <VisibilityIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Estimated Reach
                                    </Typography>
                                    <Typography variant="h3" sx={{ my: 1, color: '#4767F5', fontWeight: 'bold' }}>
                                        {estimatedReach.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4767F5', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                        <ScheduleIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Days Remaining
                                    </Typography>
                                    <Typography variant="h3" sx={{ my: 1, color: '#4767F5', fontWeight: 'bold' }}>
                                        {daysRemaining}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
}
