// pages/api/match-athletes.ts
import { $Enums, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { campaignId } = req.body;

    try {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        const athletes = await prisma.studentAthlete.findMany();

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const matchedAthletes = athletes
            .map((athlete) => ({
                athlete,
                score: calculateMatchScore(campaign, athlete),
            }))
            .sort((a, b) => b.score - a.score); // Sort by score (descending)

        res.status(200).json(matchedAthletes);
    } catch (error) {
        console.error('Error matching athletes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function calculateMatchScore(campaign: { name: string; campaignSummary: string; maxBudget: string; compensation: $Enums.Compensations; studentAthleteCount: number; sports: string[]; startDate: Date; endDate: Date; aiSummary: string; objectives: string; targetAudienceMin: number; targetAudienceMax: number; athleteIntegration: string; channels: string; timeline: string; budgetBreakdown: string; creativeConcept: string; brandTone: string; influencerAngle: string; brandMentions: string; metrics: string; questions: string; productLaunch: boolean; engagementGoal: number | null; conversionGoal: number | null; impressionsGoal: number | null; contentDeliverables: string | null; eventPromotion: boolean; csrInitiative: boolean; id: string; status: string; createdAt: Date; businessId: number; }, athlete: { name: string; compensation: $Enums.Compensations[]; id: number; createdAt: Date; email: string; image: string | null; age: number; sport: string; major: string; gender: string; ethnicity: string; introBlurb: string | null; instagram: string | null; tiktok: string | null; pinterest: string | null; linkedIn: string | null; twitter: string | null; industries: string[]; marketingOptions: $Enums.MarketingOptions[]; hoursPerWeek: number | null; }) {
    let score = 0;

    // Example: Award points if sports match
    if (campaign.sports.includes(athlete.sport)) {
        score += 10;
    }

    // Add more scoring logic here based on your criteria...

    return score;
}