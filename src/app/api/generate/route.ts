import { NextResponse } from 'next/server';
import { model } from '@/libs/gemini';
import { Campaign, CampaignStatus } from '@prisma/client';
import { CampaignFormData } from '@/utils/types';
import { GET } from '@/app/api/business/route';

export async function POST(request: Request) {
  try {
    // Parse the request body as CampaignFormData
    const formData: CampaignFormData = await request.json();

    // Extract all necessary fields from the form data
    const {
      name,
      campaignSummary,
      maxBudget,
      compensation,
      sports,
      startDate,
      endDate,
      businessId
    } = formData;

    console.log("fetching data")
    // Fetch business details from the API
    const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const businessResponse = await GET(new Request(`${base_url}/api/business?id=${businessId}`));

    console.log("fetched data")
    if (!businessResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch business details: ${businessResponse.statusText}` },
        { status: businessResponse.status }
      );
    }

    console.log("data fetched")

    const business = await businessResponse.json();

    console.log("data parsed")

    const prompt = `Generate a detailed marketing campaign strategy with the following details:
      - Business Name: ${business.name}
      - Business Mission: ${business.missionStatement}
      - Business Industry: ${business.industry}
      - Campaign Name: ${name}
      - Campaign Summary: ${campaignSummary}
      - Budget: ${maxBudget}
      - Compensation Type: ${compensation}
      - Sports: ${sports.join(', ')}
      - Campaign Duration: ${startDate} to ${endDate}
    `;

    const response = await model.generateContent(prompt);
    const jsonData = response.response.text();

    console.log("Gemini API working")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let campaignData: any;
    try {
      campaignData = JSON.parse(jsonData);
    } catch (error) {
      console.error("Error parsing Gemini response as JSON:", error);
      console.log("Raw response:", jsonData);
      return NextResponse.json(
        { error: "Failed to parse AI-generated campaign data" },
        { status: 500 }
      );
    }

    // Ensure numeric fields are actually numbers
    const engagementGoal = campaignData.engagementGoal ? Number(campaignData.engagementGoal) : null;
    const conversionGoal = campaignData.conversionGoal ? Number(campaignData.conversionGoal) : null;
    const impressionsGoal = campaignData.impressionsGoal ? Number(campaignData.impressionsGoal) : null;
    const targetAudienceMin = Number(campaignData.targetAudienceMin);
    const targetAudienceMax = Number(campaignData.targetAudienceMax);
    const studentAthleteCount = Number(campaignData.studentAthleteCount) || 3; // Default to 3 if not provided

    // Map form data and AI response to a Campaign object
    const campaign: Omit<Campaign, 'id' | 'businessId' | 'createdAt'> = {
      name,
      campaignSummary,
      maxBudget,
      compensation: compensation,
      studentAthleteCount,
      sports,
      startDate,
      endDate,

      aiSummary: campaignData.aiSummary || '',
      objectives: campaignData.objectives || '',
      targetAudienceMin,
      targetAudienceMax,
      athleteIntegration: campaignData.athleteIntegration || '',
      channels: campaignData.channels || '',
      timeline: campaignData.timeline || '',
      budgetBreakdown: campaignData.budgetBreakdown || '',
      creativeConcept: campaignData.creativeConcept || '',
      brandTone: campaignData.brandTone || '',
      influencerAngle: campaignData.influencerAngle || '',
      brandMentions: campaignData.brandMentions || '',
      metrics: campaignData.metrics || '',
      questions: campaignData.questions || '',

      // Boolean and optional numeric fields
      productLaunch: Boolean(campaignData.productLaunch),
      engagementGoal,
      conversionGoal,
      impressionsGoal,
      contentDeliverables: campaignData.contentDeliverables || null,
      eventPromotion: Boolean(campaignData.eventPromotion),
      csrInitiative: Boolean(campaignData.csrInitiative),

      // Default status for new campaigns
      status: CampaignStatus.PENDING
    };

    // Return the campaign object without saving to the database
    return NextResponse.json({
      campaign: campaign
    });

  } catch (error) {
    console.error("Error processing campaign request:", error);
    return NextResponse.json(
      { error: "Failed to process campaign request" },
      { status: 500 }
    );
  }
}
