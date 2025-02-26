import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { CampaignStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      name,
      campaignSummary,
      maxBudget,
      compensation,
      studentAthleteCount,
      sports,
      businessId,
      startDate,
      endDate,
      selectedAthleteIds = [], // Array of athlete IDs to connect
    } = data;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        campaignSummary,
        maxBudget,
        compensation,
        studentAthleteCount,
        sports,
        status: CampaignStatus.PENDING,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        businessId,
        studentAthletes: {
          connect: selectedAthleteIds.map((id: number) => ({ id }))
        }
      },
      include: {
        business: true,
        studentAthletes: true
      }
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
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
        where: { id },
        include: {
          business: true,
          studentAthletes: true
        }
      });
      return NextResponse.json(campaign);
    }

    if (businessId) {
      const campaigns = await prisma.campaign.findMany({
        where: { businessId: parseInt(businessId) },
        include: {
          business: true,
          studentAthletes: true
        }
      });
      return NextResponse.json(campaigns);
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        business: true,
        studentAthletes: true
      }
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
