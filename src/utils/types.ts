// Only includes intermediate types.
// For final types (i.e. anything getting added to the DB), use
// the types from prisma/schema.prisma
// For example, `import { type } from '@prisma/client';`

// There are no intermediate types (for now) for businesses and
// students, so we use the prisma types directly for both.

import { Compensations, Campaign as PrismaCampaign, StudentAthlete } from "@prisma/client";

export interface Campaign extends PrismaCampaign {
    campaign: PrismaCampaign;
    studentAthletes: StudentAthlete[];
}

export interface CampaignFormData {
    name: string;
    campaignSummary: string;
    maxBudget: string;  // can be $$$ amount or in-kind
    compensation: Compensations;
    sports: string[];
    sportsGender: 'mens' | 'womens'; // Add this field
    startDate: Date;
    endDate: Date;
    businessId: number; // ID of the business creating the campaign
}

export interface GeneratedCampaign {
    objectives: string;
    targetAudience: string;
    channels: string;
    timeline: string;
    budgetBreakdown: string;
    creativeConcept: string;
    metrics: string;
}

export interface MonthlyAnalytics {
  month: string;
  timestamp: number;
  investment: number;
  revenue: number;
  profit: number;
}

export interface CampaignDistribution {
  name: string;
  value: number;
}

export interface AnalyticsDataWithROI extends MonthlyAnalytics {
  roi: string;
}

export const mensSportsOptions = [
  'Rowing',
  'Golf',
  'Tennis',
  'Track and Field',
  'Soccer',
  'Baseball',
  'Basketball',
  'Cross Country',
  'Football',
  'Other'
];

export const womensSportsOptions = [
  'Rowing',
  'Beach Volleyball',
  'Gymnastics',
  'Softball',
  'Golf',
  'Tennis',
  'Track and Field',
  'Volleyball',
  'Cross Country',
  'Soccer',
  'Basketball',
];