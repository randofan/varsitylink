'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CampaignPerformanceDashboard = () => {
  // Sample data for campaign metrics
  const campaignData = [
    { athlete: 'Jordan M.', impressions: 18500, engagement: 2775, clicks: 925, conversions: 132 },
    { athlete: 'Taylor S.', impressions: 12200, engagement: 1830, clicks: 610, conversions: 87 },
    { athlete: 'Alex W.', impressions: 9800, engagement: 1470, clicks: 392, conversions: 56 },
    { athlete: 'Sam T.', impressions: 14300, engagement: 2145, clicks: 715, conversions: 102 }
  ];
  // Calculate engagement rates
  const engagementData = campaignData.map(item => ({
    athlete: item.athlete,
    'Engagement Rate': ((item.engagement / item.impressions) * 100).toFixed(1),
    'Click Rate': ((item.clicks / item.impressions) * 100).toFixed(1),
    'Conversion Rate': ((item.conversions / item.clicks) * 100).toFixed(1)
  }));
  // Data for demographics pie chart
  const demographicData = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Campaign Performance Dashboard</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Engagement Metrics by Athlete</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="athlete" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Engagement Rate" fill="#8884d8" />
            <Bar dataKey="Click Rate" fill="#82ca9d" />
            <Bar dataKey="Conversion Rate" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Audience Demographics</h3>
          <ResponsiveContainer width="100%" height={300}>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">CAC Comparison</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-2">Marketing Channel</th>
                  <th className="text-right p-2">CAC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-2">NIL Athletes</td>
                  <td className="text-right font-bold text-green-600 p-2">$18.75</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2">Social Media Ads</td>
                  <td className="text-right p-2">$32.40</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2">Google Ads</td>
                  <td className="text-right p-2">$28.15</td>
                </tr>
                <tr>
                  <td className="p-2">Traditional Media</td>
                  <td className="text-right p-2">$45.60</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-bold text-lg">CAC Savings:</p>
            <p className="text-2xl font-bold text-blue-600">42%</p>
            <p className="text-sm text-gray-600">Compared to traditional marketing channels</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPerformanceDashboard;
