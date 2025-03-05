"use client";
import React, { useState } from 'react';
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

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Paper
} from '@mui/material';

// Sample data - replace with your actual data
const roiData = [
  { month: 'Jan', investment: 10000, revenue: 15000, profit: 5000 },
  { month: 'Feb', investment: 12000, revenue: 20000, profit: 8000 },
  { month: 'Mar', investment: 14000, revenue: 25000, profit: 11000 },
  { month: 'Apr', investment: 16000, revenue: 32000, profit: 16000 },
  { month: 'May', investment: 18000, revenue: 38000, profit: 20000 },
  { month: 'Jun', investment: 20000, revenue: 45000, profit: 25000 },
];

const projectData = [
  { name: 'Project A', value: 35 },
  { name: 'Project B', value: 25 },
  { name: 'Project C', value: 20 },
  { name: 'Project D', value: 15 },
  { name: 'Project E', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const calculateROI = (investment: number, profit: number) => {
  return ((profit - investment) / investment) * 100;
};

const BusinessROIDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState('6m');

  const handleTimeframeChange = (event: SelectChangeEvent) => {
    setTimeframe(event.target.value as string);
  };

  // Calculate ROI for each month
  const dataWithROI = roiData.map(item => ({
    ...item,
    roi: calculateROI(item.investment, item.revenue).toFixed(2)
  }));

  // Calculate overall ROI
  const totalInvestment = roiData.reduce((sum, item) => sum + item.investment, 0);
  const totalRevenue = roiData.reduce((sum, item) => sum + item.revenue, 0);
  const overallROI = calculateROI(totalInvestment, totalRevenue).toFixed(2);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Business ROI Dashboard
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
          <Card>
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
          <Card>
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
          <Card>
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
          <Paper sx={{ p: 2 }}>
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Project ROI Distribution
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Investment vs. Revenue
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
                <Bar dataKey="investment" fill="#8884d8" name="Investment" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                <Bar dataKey="profit" fill="#ffc658" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessROIDashboard;
