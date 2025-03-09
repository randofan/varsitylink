'use client';

import { Box, Container, Typography, Grid, Card, CardContent, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import CampaignCard from '@/components/CampaignCard';
import BusinessHeader from '@/components/BusinessHeader';
import { useCampaigns } from '@/hooks/useCampaigns';
import AnimatedLoader from '@/components/HomeLoading';
import React, { useState, useMemo } from 'react';
import { Campaign, MonthlyAnalytics, CampaignDistribution, AnalyticsDataWithROI } from '@/utils/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Utility functions for data processing
const generateMonthlyData = (campaigns: Campaign[]): MonthlyAnalytics[] => {
  const months: MonthlyAnalytics[] = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: month.toLocaleString('default', { month: 'short' }),
      timestamp: month.getTime(),
      investment: 0,
      revenue: 0,
      profit: 0
    });
  }

  campaigns.forEach(campaign => {
    // Handle Date objects from Prisma
    const startDate = campaign.startDate instanceof Date
      ? campaign.startDate
      : new Date(campaign.startDate);

    // Parse maxBudget as number, default to 0 if invalid
    const budget = parseFloat(campaign.maxBudget) || 0;
    const estimatedRevenue = budget * 1.5; // Simple revenue estimation
    const profit = estimatedRevenue - budget;

    const monthIndex = months.findIndex(m => {
      const monthStart = new Date(m.timestamp);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      return startDate >= monthStart && startDate <= monthEnd;
    });

    if (monthIndex >= 0) {
      months[monthIndex].investment += budget;
      months[monthIndex].revenue += estimatedRevenue;
      months[monthIndex].profit += profit;
    }
  });

  return months;
};

const generateCampaignDistribution = (campaigns: Campaign[]): CampaignDistribution[] => {
  return campaigns
    .slice(0, 5)
    .map(campaign => ({
      name: campaign.name || 'Unnamed Campaign',
      value: Number(campaign.maxBudget) || 0
    }));
};

const calculateROI = (investment: number, revenue: number): number => {
  return investment > 0 ? ((revenue - investment) / investment) * 100 : 0;
};

const COLORS = ['#4767F5', '#3852c4', '#6384FF', '#8293FF', '#2941B9'];

export default function CampaignsPage() {
  const { campaigns, loading, error } = useCampaigns(1);
  const [timeframe, setTimeframe] = useState<string>('6m');

  const handleTimeframeChange = (event: SelectChangeEvent<string>) => {
    setTimeframe(event.target.value);
  };

  // Process campaign data for analytics
  const roiData = useMemo<MonthlyAnalytics[]>(() => {
    if (!campaigns || campaigns.length === 0) {
      return [];
    }
    return generateMonthlyData(campaigns);
  }, [campaigns]);

  const projectData = useMemo<CampaignDistribution[]>(() => {
    if (!campaigns || campaigns.length === 0) {
      return [];
    }
    return generateCampaignDistribution(campaigns);
  }, [campaigns]);

  // Calculate ROI for each month
  const dataWithROI = useMemo<AnalyticsDataWithROI[]>(() => {
    return roiData.map(item => ({
      ...item,
      roi: calculateROI(item.investment, item.revenue).toFixed(2)
    }));
  }, [roiData]);

  // Calculate overall metrics
  const totalInvestment = useMemo(() =>
    roiData.reduce((sum, item) => sum + item.investment, 0),
    [roiData]
  );

  const totalRevenue = useMemo(() =>
    roiData.reduce((sum, item) => sum + item.revenue, 0),
    [roiData]
  );

  const overallROI = useMemo(() =>
    calculateROI(totalInvestment, totalRevenue).toFixed(2),
    [totalInvestment, totalRevenue]
  );

  if (loading) {
    return <AnimatedLoader />;
  }

  if (error) {
    return (
      <>
        <BusinessHeader />
        <Container sx={{ mt: 4 }}>
          <Typography color="error">Error: {error}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <BusinessHeader />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Your Campaigns
        </Typography>
        {loading ? (
          <Typography>Loading campaigns...</Typography>
        ) : campaigns.length === 0 ? (
          <Typography>No current campaigns</Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3,
            mb: 6
          }}>
            {campaigns.map((campaign: Campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </Box>
        )}

        {/* Analytics Dashboard */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Business Dashboard
          </Typography>
          <Grid container spacing={3}>
            {/* Controls */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Timeframe"
                    onChange={handleTimeframeChange}
                  >
                    <MenuItem value="1m">1 Month</MenuItem>
                    <MenuItem value="3m">3 Months</MenuItem>
                    <MenuItem value="6m">6 Months</MenuItem>
                    <MenuItem value="1y">1 Year</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* KPI Cards */}
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">
                    Total Investment
                  </Typography>
                  <Typography variant="h4">
                    ${totalInvestment.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">
                    Overall ROI
                  </Typography>
                  <Typography variant="h4">
                    {overallROI}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>
                  Monthly ROI Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={dataWithROI}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>
                  Campaign Performance Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>
                  Campaign Investment vs. Revenue
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={roiData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="investment" fill="#4767F5" name="Investment" />
                    <Bar dataKey="revenue" fill="#3852c4" name="Revenue" />
                    <Bar dataKey="profit" fill="#2941B9" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
