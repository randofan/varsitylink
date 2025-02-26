import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { studentAthletes, ...campaignData } = data;
    const studentAthleteIds = studentAthletes?.map((athlete: { id: number; }) => athlete.id) || [];

    const campaign = await prisma.campaign.create({
      data: {
        name: campaignData.name,
        campaignSummary: campaignData.campaignSummary,
        maxBudget: campaignData.maxBudget,
        compensation: campaignData.compensation,
        studentAthleteCount: parseInt(campaignData.studentAthleteCount) || 0,
        sports: campaignData.sports || [],
        startDate: new Date(campaignData.startDate),
        endDate: new Date(campaignData.endDate),
        businessId: parseInt(campaignData.businessId || "1"),
        status: campaignData.status || "PENDING",

        // Connect student athletes
        studentAthletes: {
          connect: studentAthleteIds.map((id: string | number) => ({
            id: typeof id === 'string' ? parseInt(id) : id
          }))
        },

        // Add other fields with defaults
        aiSummary: campaignData.aiSummary || "",
        objectives: campaignData.objectives || "",
        targetAudienceMin: parseInt(campaignData.targetAudienceMin) || 0,
        targetAudienceMax: parseInt(campaignData.targetAudienceMax) || 0,
        athleteIntegration: campaignData.athleteIntegration || "",
        channels: campaignData.channels || "",
        timeline: campaignData.timeline || "",
        budgetBreakdown: campaignData.budgetBreakdown || "",
        creativeConcept: campaignData.creativeConcept || "",
        brandTone: campaignData.brandTone || "",
        influencerAngle: campaignData.influencerAngle || "",
        brandMentions: campaignData.brandMentions || "",
        metrics: campaignData.metrics || "",
        questions: campaignData.questions || "",
        productLaunch: Boolean(campaignData.productLaunch),
        engagementGoal: parseInt(campaignData.engagementGoal) || null,
        conversionGoal: parseInt(campaignData.conversionGoal) || null,
        impressionsGoal: parseInt(campaignData.impressionsGoal) || null,
        contentDeliverables: campaignData.contentDeliverables || null,
        eventPromotion: Boolean(campaignData.eventPromotion),
        csrInitiative: Boolean(campaignData.csrInitiative)
      },
      include: {
        business: true,
        studentAthletes: true
      }
    });

    return NextResponse.json({ campaign, id: campaign.id }, { status: 201 });
  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const businessId = searchParams.get('businessId');

    if (id) {
      const campaign = await prisma.campaign.findUnique({
        where: { id }, // UUID string
        include: {
          business: true,
          studentAthletes: true
        }
      });

      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json(campaign);
    }

    if (businessId) {
      const campaigns = await prisma.campaign.findMany({
        where: {
          businessId: parseInt(businessId)
        },
        include: {
          business: true,
          studentAthletes: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return NextResponse.json(campaigns);
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        business: true,
        studentAthletes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
