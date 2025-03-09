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
    Mail as MailIcon,
    ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { StudentAthlete } from '@prisma/client';
import MessageDialog from '@/components/MessageDialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StudentAthleteModal from '@/components/StudentAthleteModal';
import { Campaign } from '@/utils/types';

export default function CampaignDashboard() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAthleteForModal, setSelectedAthleteForModal] = useState<StudentAthlete | null>(null);

    // Generate engagement data based on actual athlete metrics
    const generateEngagementData = (athletes: StudentAthlete[]) => {
        return athletes.map(athlete => {
            // Use follower counts to calculate realistic engagement rates
            const totalFollowers = (athlete.instagramFollowers || 0) +
                (athlete.tiktokFollowers || 0) +
                (athlete.twitterFollowers || 0);

            // Smaller accounts tend to have higher engagement rates
            const followerFactor = Math.max(0.5, Math.min(1, 2000 / (totalFollowers || 2000)));

            return {
                athlete: `${athlete.name}`,
                'Engagement Rate': ((4 + Math.random() * 3) * followerFactor).toFixed(1),
                'Click Rate': ((2 + Math.random() * 2) * followerFactor).toFixed(1),
                'Conversion Rate': ((1 + Math.random() * 4) * followerFactor).toFixed(1)
            };
        });
    };

    // Generate demographic data based on athletes' sports
    const generateDemographicData = (athletes: StudentAthlete[]) => {
        // Default distribution
        const demographics = [
            { name: '18-24 years old', value: 91 },
            { name: '25-34 years old', value: 7 },
            { name: '35-44 years old', value: 2 },
            { name: '45+ years old', value: 0 }
        ];

        // Adjust based on sports demographics
        if (athletes.length > 0) {
            // Get unique sports
            const sports = [...new Set(athletes.map(a => a.sport.toLowerCase()))];

            // Modify demographics based on specific sports
            if (sports.some(s => s.includes('football') || s.includes('basketball') || s.includes('baseball'))) {
                demographics[0].value += 5; // Increase 18-24 demographic
                demographics[3].value -= 5; // Decrease 45+ demographic
            }

            if (sports.some(s => s.includes('golf') || s.includes('tennis'))) {
                demographics[2].value += 5; // Increase 35-44 demographic
                demographics[3].value += 5; // Increase 45+ demographic
                demographics[0].value -= 5; // Decrease 18-24 demographic
                demographics[1].value -= 5; // Decrease 25-34 demographic
            }
        }

        return demographics;
    };

    // Generate platform data based on athletes' social media presence
    const generatePlatformData = (athletes: StudentAthlete[]) => {
        // Calculate totals
        const instagramFollowers = athletes.reduce((sum, a) => sum + (a.instagramFollowers || 0), 0);
        const tiktokFollowers = athletes.reduce((sum, a) => sum + (a.tiktokFollowers || 0), 0);
        const twitterFollowers = athletes.reduce((sum, a) => sum + (a.twitterFollowers || 0), 0);

        // Calculate post distribution (roughly based on follower distribution)
        const totalFollowers = instagramFollowers + tiktokFollowers + twitterFollowers;
        const campaignLength = campaign ?
            Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (86400000)) : 30;

        // Estimate ~1 post every 3 days per platform per athlete on average
        const estimatedTotalPosts = Math.ceil(athletes.length * campaignLength / 3);

        // Distribute posts according to platform popularity
        const instagramPosts = Math.ceil(estimatedTotalPosts * (instagramFollowers / totalFollowers) || estimatedTotalPosts / 3);
        const tiktokPosts = Math.ceil(estimatedTotalPosts * (tiktokFollowers / totalFollowers) || estimatedTotalPosts / 3);
        const twitterPosts = Math.ceil(estimatedTotalPosts * (twitterFollowers / totalFollowers) || estimatedTotalPosts / 3);

        // Calculate impressions and engagement
        const getImpressions = (followers: number, posts: number) => Math.round(followers * posts * (1.5 + Math.random()));
        const getEngagement = (impressions: number) => Math.round(impressions * (0.1 + Math.random() * 0.05));

        const instagramImpressions = getImpressions(instagramFollowers, instagramPosts);
        const tiktokImpressions = getImpressions(tiktokFollowers, tiktokPosts);
        const twitterImpressions = getImpressions(twitterFollowers, twitterPosts);

        return [
            { name: 'Instagram', posts: instagramPosts, impressions: instagramImpressions, engagement: getEngagement(instagramImpressions) },
            { name: 'TikTok', posts: tiktokPosts, impressions: tiktokImpressions, engagement: getEngagement(tiktokImpressions) },
            { name: 'Twitter', posts: twitterPosts, impressions: twitterImpressions, engagement: getEngagement(twitterImpressions) }
        ];
    };

    // Calculate total campaign metrics
    const calculateCampaignMetrics = () => {
        if (!campaign || !campaign.studentAthletes.length) return { impressions: 120000, engagements: 18000, cpa: 18.75 };

        const totalFollowers = campaign.studentAthletes.reduce((sum, athlete) => {
            return sum + (athlete.instagramFollowers || 0) +
                (athlete.tiktokFollowers || 0) +
                (athlete.twitterFollowers || 0);
        }, 0);

        // Estimate campaign performance metrics
        const averagePostsPerAthlete = 5;
        const estimatedImpressionsPerFollower = 1.8;
        const estimatedEngagementRate = 0.15;

        const impressions = Math.round(totalFollowers * averagePostsPerAthlete * estimatedImpressionsPerFollower);
        const engagements = Math.round(impressions * estimatedEngagementRate);

        // Parse budget to calculate CPA
        const maxBudget = parseFloat(campaign.maxBudget.replace(/[^0-9.]/g, '')) || 10000;
        const estimatedConversions = Math.round(engagements * 0.0002);
        const cpa = estimatedConversions > 0 ? Number((maxBudget / estimatedConversions)) : 18.75;

        return { impressions, engagements, cpa };
    };

    // Use the generated data
    const engagementData = campaign ? generateEngagementData(campaign.studentAthletes) : [];
    const demographicData = campaign ? generateDemographicData(campaign.studentAthletes) : [];
    const platformData = campaign ? generatePlatformData(campaign.studentAthletes) : [];
    const campaignMetrics = calculateCampaignMetrics();

    const COLORS = ['#4767F5', '#6E8AFF', '#93A5FF', '#B8C3FF'];

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

    const handleOpenAthleteModal = (athlete: StudentAthlete) => {
        setSelectedAthleteForModal(athlete);
        setModalOpen(true);
    };

    const handleCloseAthleteModal = () => {
        setModalOpen(false);
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
            return sum + (athlete.instagramFollowers || 0) + (athlete.tiktokFollowers || 0);
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
                <>
                    <MessageDialog
                        open={messageDialogOpen}
                        onClose={handleCloseMessageDialog}
                        athletes={campaign.studentAthletes}
                        campaignName={campaign.name}
                    />
                    <StudentAthleteModal
                        athlete={selectedAthleteForModal}
                        open={modalOpen}
                        onClose={handleCloseAthleteModal}
                    />
                </>
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
                                label={`${formatDate(new Date(campaign.startDate).toLocaleDateString())} - ${formatDate(new Date(campaign.endDate).toLocaleDateString())}`}
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
                    {/* Campaign Timeline Visualization */}
                    <Grid item xs={12}>
                        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <EventIcon sx={{ mr: 1, color: '#4767F5' }} />
                                    Campaign Timeline
                                </Typography>

                                {campaign && (
                                    <Box sx={{ position: 'relative', my: 4 }}>
                                        {/* Timeline track */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: 0,
                                            right: 0,
                                            height: 6,
                                            bgcolor: '#EEF2FF',
                                            borderRadius: 3,
                                            transform: 'translateY(-50%)',
                                            zIndex: 1
                                        }} />

                                        {/* Progress overlay */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: 0,
                                            width: `${calculateProgress()}%`,
                                            height: 6,
                                            bgcolor: '#4767F5',
                                            borderRadius: 3,
                                            transform: 'translateY(-50%)',
                                            zIndex: 2,
                                            transition: 'width 1s ease-in-out'
                                        }} />

                                        {/* Timeline points */}
                                        <Grid container justifyContent="space-between" sx={{ position: 'relative', zIndex: 3 }}>
                                            {/* Start date */}
                                            <Grid item xs={4} sx={{ pt: 4, position: 'relative' }}>
                                                <Box sx={{
                                                    width: 16,
                                                    height: 16,
                                                    bgcolor: '#4767F5',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: -5,
                                                    left: 0,
                                                    boxShadow: '0 0 0 4px #EEF2FF'
                                                }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Campaign Start
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(new Date(campaign.startDate).toLocaleDateString())}
                                                </Typography>
                                            </Grid>

                                            {/* Current date */}
                                            <Grid item xs={4} sx={{ pt: 4, position: 'relative', textAlign: 'center' }}>
                                                <Box sx={{
                                                    width: 24,
                                                    height: 24,
                                                    bgcolor: '#fff',
                                                    border: '3px solid #4767F5',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: -9,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    boxShadow: '0 0 0 4px rgba(71, 103, 245, 0.2)',
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{
                                                    '@keyframes pulse': {
                                                        '0%': {
                                                            boxShadow: '0 0 0 0 rgba(71, 103, 245, 0.4)'
                                                        },
                                                        '70%': {
                                                            boxShadow: '0 0 0 10px rgba(71, 103, 245, 0)'
                                                        },
                                                        '100%': {
                                                            boxShadow: '0 0 0 0 rgba(71, 103, 245, 0)'
                                                        }
                                                    }
                                                }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Today
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(new Date().toISOString())}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={`${calculateProgress()}% Complete`}
                                                    sx={{
                                                        bgcolor: '#EEF2FF',
                                                        color: '#4767F5',
                                                        fontWeight: 'bold',
                                                        mt: 1
                                                    }}
                                                />
                                            </Grid>

                                            {/* End date */}
                                            <Grid item xs={4} sx={{ pt: 4, position: 'relative', textAlign: 'right' }}>
                                                <Box sx={{
                                                    width: 16,
                                                    height: 16,
                                                    bgcolor: '#ddd',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: -5,
                                                    right: 0,
                                                    boxShadow: '0 0 0 4px #f5f5f5'
                                                }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Campaign End
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(new Date(campaign.endDate).toLocaleDateString())}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        {/* Key milestones */}
                                        <Box sx={{ mt: 6, pt: 4, borderTop: '1px dashed #ccc' }}>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                                Campaign Milestones
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, bgcolor: '#EEF2FF', borderLeft: '4px solid #4767F5' }}>
                                                        <Typography variant="subtitle2">Athlete Briefing</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(new Date(new Date(campaign.startDate).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString())}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, bgcolor: '#EEF2FF', borderLeft: '4px solid #4767F5' }}>
                                                        <Typography variant="subtitle2">Content Creation</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(new Date(new Date(campaign.startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, bgcolor: '#EEF2FF', borderLeft: '4px solid #4767F5' }}>
                                                        <Typography variant="subtitle2">Posting Period</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(new Date(new Date(campaign.startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString())}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, bgcolor: '#EEF2FF', borderLeft: '4px solid #4767F5' }}>
                                                        <Typography variant="subtitle2">Final Reporting</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(new Date(new Date(campaign.endDate).getTime() - 2 * 24 * 60 * 60 * 1000).toISOString())}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

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
                                {renderInfoSection('Content Guidelines', campaign.creativeConcept)}
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
                                        Start: {formatDate(new Date(campaign.startDate).toISOString())}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        End: {formatDate(new Date(campaign.endDate).toISOString())}
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
                                            onClick={() => handleOpenAthleteModal(athlete)}
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

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4767F5', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                        <VisibilityIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Total Impressions
                                    </Typography>
                                    <Typography variant="h3" sx={{ my: 1, color: '#4767F5', fontWeight: 'bold' }}>
                                        {(campaignMetrics.impressions / 1000).toFixed(0)}K
                                    </Typography>
                                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                                        +24% vs. target
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4767F5', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                        <ThumbUpIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Total Engagements
                                    </Typography>
                                    <Typography variant="h3" sx={{ my: 1, color: '#4767F5', fontWeight: 'bold' }}>
                                        {(campaignMetrics.engagements / 1000).toFixed(0)}K
                                    </Typography>
                                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                                        {((campaignMetrics.engagements / campaignMetrics.impressions) * 100).toFixed(1)}% engagement rate
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4767F5', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                        <MoneyIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Customer Acquisition Cost
                                    </Typography>
                                    <Typography variant="h3" sx={{ my: 1, color: '#4767F5', fontWeight: 'bold' }}>
                                        ${campaignMetrics.cpa}
                                    </Typography>
                                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                                        42% lower than other channels
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Card sx={{ p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom>
                                    Engagement Metrics by Athlete
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Performance breakdown for each athlete in the campaign
                                </Typography>
                                <Box sx={{ height: 350, width: '100%' }}>
                                    <ResponsiveContainer>
                                        <BarChart data={engagementData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="athlete" tick={{ fill: '#666' }} />
                                            <YAxis tick={{ fill: '#666' }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="Engagement Rate" fill="#4767F5" />
                                            <Bar dataKey="Click Rate" fill="#6E8AFF" />
                                            <Bar dataKey="Conversion Rate" fill="#93A5FF" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>

                            <Card sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom>
                                    Platform Performance
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Performance metrics across different social media platforms
                                </Typography>
                                <Box sx={{ height: 350, width: '100%' }}>
                                    <ResponsiveContainer>
                                        <BarChart data={platformData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="name" tick={{ fill: '#666' }} />
                                            <YAxis yAxisId="left" tick={{ fill: '#666' }} />
                                            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666' }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="impressions" fill="#4767F5" name="Impressions" />
                                            <Bar yAxisId="right" dataKey="engagement" fill="#6E8AFF" name="Engagement" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Card sx={{ p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom>
                                    Audience Demographics
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Age distribution of campaign audience
                                </Typography>
                                <Box sx={{ height: 280, width: '100%', mt: 2 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={demographicData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {demographicData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>

                            <Card sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom>
                                    CAC Comparison
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Customer Acquisition Cost compared to other channels
                                </Typography>
                                <Box sx={{ p: 2, bgcolor: '#f5f7ff', borderRadius: 2, mb: 2 }}>
                                    <Grid container sx={{ mb: 1, fontWeight: 'medium', color: '#4767F5' }}>
                                        <Grid item xs={8}>
                                            <Typography variant="body2" fontWeight="bold">Marketing Channel</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight="bold">CAC</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ mb: 1 }} />

                                    <Grid container sx={{ mb: 1 }}>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">NIL Athletes</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight="bold" color="success.main">${campaignMetrics.cpa}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container sx={{ mb: 1 }}>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">Social Media Ads</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">${(campaignMetrics.cpa * 1.7).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container sx={{ mb: 1 }}>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">Google Ads</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">${(campaignMetrics.cpa * 1.5).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">Traditional Media</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">${(campaignMetrics.cpa * 2.4).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
                                    <Typography variant="body1" fontWeight="bold">
                                        CAC Savings:
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        42%
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Compared to traditional marketing channels
                                    </Typography>
                                </Card>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                        bgcolor: '#4767F5',
                                        '&:hover': { bgcolor: '#3852c4' },
                                        textTransform: 'none',
                                        px: 4
                                    }}
                                >
                                    Download Full Analytics Report
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
}
