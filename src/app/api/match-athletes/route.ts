import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

import { $Enums } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {

    // console.log('**req.body:', req.body);
    // const { campaignId } = req.body;
    // console.log('**campaignId:', campaignId);

    try {
      const campaign = await prisma.campaign.findUnique({ where: { id: 'campaign1' } });
      const athletes = await prisma.studentAthlete.findMany();

      if (!campaign) {
          return res.status(404).json({ error: 'Campaign not found' });
      } else {
          console.log('**campaign found:');
      }

      const matchedAthletes = athletes
          .map((athlete) => ({
              athlete,
              score: calculateMatchScore(campaign, athlete),
          }))
          .sort((a, b) => b.score - a.score); // Sort by score (descending)

          console.log('matchedAthletes:', matchedAthletes);
      return NextResponse.json({ message: matchedAthletes }, { status: 201 });
    } catch (error) {
        console.error('Error matching athletes:', error);
        return NextResponse.json({ error: 'Error matching athletes:' }, { status: 500 });
    }

}

function calculateMatchScore(
  campaign: { name: string; campaignSummary: string; maxBudget: string; compensation: $Enums.Compensations; studentAthleteCount: number; sports: string[]; startDate: Date; endDate: Date; aiSummary: string; objectives: string; targetAudienceMin: number; targetAudienceMax: number; athleteIntegration: string; channels: string; timeline: string; budgetBreakdown: string; creativeConcept: string; brandTone: string; influencerAngle: string; brandMentions: string; metrics: string; questions: string; productLaunch: boolean; engagementGoal: number | null; conversionGoal: number | null; impressionsGoal: number | null; contentDeliverables: string | null; eventPromotion: boolean; csrInitiative: boolean; id: string; status: string; createdAt: Date; businessId: number; }, 
  athlete: { name: string; compensation: $Enums.Compensations[]; id: number; createdAt: Date; email: string; image: string | null; age: number; sport: string; major: string; gender: string; ethnicity: string; introBlurb: string | null; instagram: string | null; tiktok: string | null; pinterest: string | null; linkedIn: string | null; twitter: string | null; industries: string[]; marketingOptions: $Enums.MarketingOptions[]; hoursPerWeek: number | null; }) {
  let score = 0;

  console.log('**calculateMatchScore:');
  // console.log('**athlete:', athlete);
  // Example: Award points if sports match
  if (campaign.sports.includes(athlete.sport)) {
      console.log('Award points if sports match: ', athlete.sport);
      score += 10;
  }

  // Add more scoring logic here based on your criteria...

  //console.log('Award points if sports match: ', score);
  return score;
}
