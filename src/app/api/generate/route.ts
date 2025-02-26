import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemInstruction = `
You are an AI marketing strategist specializing in athlete-driven campaigns for small to mid-sized businesses.
Generate a structured marketing campaign strategy tailored to businesses looking to collaborate with athletes for
brand promotion. The response must be formatted as a JSON object with the following fields:
{
  "objectives": "string- Define the campaign key objectives. Ensure they align with the business's goals and the athlete’s influence. Be realistic—avoid false claims or unattainable promises.",
  "targetAudienceMin": integer- Specify the minimum age of the ideal audience.,
  "targetAudienceMax": integer- Specify the maximum age of the ideal audience.,
  "athleteIntegration": "string: Describe how the business should leverage athlete partnerships. Provide strategies for content creation, engagement, and aligning the athlete’s brand with the business identity.",
  "channels": "string: List the best marketing channels (social media, email, influencer content, etc.). Explain why each channel is relevant and how it connects with the target audience.",
  "timeline": "string: Propose a structured campaign timeline. Include athlete content releases, social media posting schedules, and performance review checkpoints.",
  "budgetBreakdown": "string: Provide a detailed allocation of budget across athlete partnerships, content creation, advertising, and platform costs. Suggest ways to optimize the budget effectively.",
  "creativeConcept": "string: Develop a compelling creative direction. Suggest messaging themes, visual storytelling, and engagement tactics that resonate with the target audience.",
  "metrics": "string: List the key performance indicators (KPIs) to measure campaign success, such as engagement rate, conversions, and ROI. Suggest industry-standard tools to track them.",
  "questions": "string: Provide a list of strategic questions businesses should ask to refine their campaign and improve future marketing efforts.",
  "productLaunch": boolean- Specify whether the campaign is focused on launching a new product (true/false).,
  "engagementGoal": integer | null- Estimate the target number of likes, shares, and comments the campaign should aim for.,
  "conversionGoal": integer | null- Estimate the number of expected conversions (sales, sign-ups, etc.).,
  "impressionsGoal": integer | null- Estimate the projected reach in terms of social media impressions.,
  "contentDeliverables": "string | null: List specific content types that will be created (e.g., videos, social media posts, athlete interviews).",
  "eventPromotion": boolean- Specify whether the campaign involves an event (true/false)."
  "csrInitiative": boolean- Specify whether the campaign ties into a social impact initiative (true/false).
}
Return only JSON. Ensure that all numeric fields are returned as integers and boolean fields are true/false, NOT strings. Return only the JSON object with no extra text or formatting.
  `;

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
// const API_KEY = process.env.GEMINI_API_KEY;
const API_KEY = "AIzaSyD4x9egxBaSWYDViOXhDfKpTtZGSDAygss"

if (!API_KEY) throw new Error("Missing API_KEY in environment variables.");
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction,
    generationConfig: {
        responseMimeType: "application/json",
    }
});

interface Campaign {
  objectives: string;
  targetAudienceMin: number;
  targetAudienceMax: number;
  athleteIntegration: string;
  channels: string;
  timeline: string;
  budgetBreakdown: string;
  creativeConcept: string;
  metrics: string;
  questions: string;
  productLaunch: boolean;
  engagementGoal: number;
  conversionGoal: number;
  impressionsGoal: number;
  contentDeliverables: string;
  eventPromotion: boolean;
  csrInitiative: boolean;
}

function convertValue<T>(value: any, expectedType: string): any {
  if (expectedType === 'number') {
    return !isNaN(value) ? Number(value) : null;  // Return null if conversion fails
  }

  if (expectedType === 'boolean') {
    return value === 'true' || value === true;
  }

  // For string or other types, return the value itself
  return value;
}

function validateAndConvertJsonString(jsonString: string, expectedType: Campaign): string {
  // Step 1: Parse the JSON string into an object
  let json;
  try {
    json = JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    throw new Error("Invalid JSON string");
  }

  // Step 2: Validate and convert types
  for (const key in expectedType) {
    if (json.hasOwnProperty(key)) {
      const expectedValue = expectedType[key as keyof Campaign];
      const actualValue = json[key];

      // Check and convert types
      const actualType = typeof actualValue;

      if (actualType !== typeof expectedValue) {
        console.log(`Type mismatch for key "${key}". Expected: ${typeof expectedValue}, Found: ${actualType}`);
        
        // Convert value based on expected type
        json[key] = convertValue(actualValue, typeof expectedValue);
        console.log(`Updated value for "${key}": ${json[key]}`);
      }
    } else {
      // If the key is missing, set it to null
      console.log(`Missing key: ${key}. Setting it to null.`);
      json[key] = null;
    }
  }

  // Step 3: Return the updated JSON string
  return JSON.stringify(json, null, 2); // Pretty print the JSON string
}

export async function POST(request: Request) {
    console.log("Received request:", request);
    const body = await request.json();
    console.log("Request body:", body);
    const { campaignSummary, budget, athletePartnerCount, sports, customSport } = body;

    const sportsText = customSport
        ? [...sports, customSport].join(', ')
        : sports.join(', ');

    const prompt = `Generate a detailed marketing campaign strategy for a small-mid sized business with the following details:
    - Campaign Summary: ${campaignSummary}
    - Budget: ${budget}
    - Athlete Partner Count: ${athletePartnerCount}
    - Sports: ${sportsText}
    - Custom Sport: ${customSport ? customSport : 'None'}
    - Objectives: Increase brand awareness and drive sales
    - Target Audience: Young adults aged 18-30
    `;
    console.log("Generated prompt:", prompt);
    const response = await model.generateContent(prompt);
    console.log("Model response:", response);

    const data = await response.response.text(); // Ensure response is properly parsed
    console.log("Raw response data:", data);

    let validJsonString;
    try {
        validJsonString = validateAndConvertJsonString(data, {} as Campaign);
    } catch (error) {
        console.error("Error validating JSON string:", error);
        throw new Error("Failed to validate and convert JSON string");
    }

    return NextResponse.json({ draftCampaign: validJsonString });
}
