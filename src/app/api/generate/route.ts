import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemInstruction = `
You are an AI marketing strategist. Generate a detailed marketing
campaign strategy. Provide the following keys in your JSON response:
{
  "objectives": "List the main objectives",
  "targetAudience": "Describe the target audience",
  "channels": "List marketing channels",
  "timeline": "Suggest a timeline",
  "budgetBreakdown": "Detail the budget allocation",
  "creativeConcept": "Propose creative concepts",
  "metrics": "List key performance metrics"
}
Return only JSON.
  `;

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("Missing API_KEY in environment variables.");
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction,
    generationConfig: {
        responseMimeType: "application/json",
    }
});

export async function POST(request: Request) {
    const body = await request.json();
    const { campaignSummary, budget, athletePartnerCount, sports, customSport } = body;

    const sportsText = customSport
        ? [...sports, customSport].join(', ')
        : sports.join(', ');

    const prompt = `Generate a detailed marketing campaign strategy for a small business with the following details:
    - Campaign Summary: ${campaignSummary}
    - Budget: ${budget}
    - Athlete Partner Count: ${athletePartnerCount}
    - Sports: ${sportsText}
    - Custom Sport: ${customSport ? customSport : 'None'}
    - Objectives: Increase brand awareness and drive sales
    - Target Audience: Young adults aged 18-30
    `;
    const response = await model.generateContent(prompt);
    const data = response.response.text();
    const jsonData = JSON.parse(data);
    return NextResponse.json({ draftCampaign: jsonData });
}
