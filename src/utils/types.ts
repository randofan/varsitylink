// Only includes intermediate types.
// For final types (i.e. anything getting added to the DB), use
// the types from prisma/schema.prisma
// For example, `import { type } from '@prisma/client';`

// There are no intermediate types (for now) for businesses and
// students, so we use the prisma types directly for both.

import { Compensations } from "@prisma/client";


export interface CampaignFormData {
    name: string;
    campaignSummary: string;
    maxBudget: string;  // can be $$$ amount or in-kind
    compensation: Compensations;
    studentAthleteCount: string;  // can be a number of 'any', in which case we'll choose
    sports: string[];
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

export const sportsOptions = [
    'Baseball',
    'Basketball',
    'Football',
    'Golf',
    'Soccer',
    'Tennis',
    'Track and Field',
    'Volleyball',
    'Wrestling',
    'Other'
];