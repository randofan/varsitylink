import { GoogleGenerativeAI } from '@google/generative-ai';

const systemInstruction = `Generate a structured marketing campaign strategy tailored to businesses looking to collaborate with athletes for
brand promotion. The response must be formatted as a JSON object with the following fields:
{
  "aiSummary": "string: Provide a brief summary of the campaign, highlighting its key features and expected outcomes.",
  "objectives": "string- Define the campaign key objectives. Ensure they align with the business's goals and the athlete's influence. Be realistic—avoid false claims or unattainable promises.",
  "targetAudienceMin": integer- Specify the minimum age of the ideal audience.,
  "targetAudienceMax": integer- Specify the maximum age of the ideal audience.,
  "athleteIntegration": "string: Describe how the business should leverage athlete partnerships. Provide strategies for content creation, engagement, and aligning the athlete's brand with the business identity.",
  "channels": "string: List the best marketing channels (social media, email, influencer content, etc.). Explain why each channel is relevant and how it connects with the target audience.",
  "timeline": "string: Propose a structured campaign timeline. Include athlete content releases, social media posting schedules, and performance review checkpoints.",
  "budgetBreakdown": "string: Provide a detailed allocation of budget across athlete partnerships, content creation, advertising, and platform costs. Suggest ways to optimize the budget effectively.",
  "creativeConcept": "string: Develop a compelling creative direction. Suggest messaging themes, visual storytelling, and engagement tactics that resonate with the target audience.",
  "brandTone": "string: Define the voice and tone that should be used in all campaign materials. Ensure it aligns with the business's existing brand voice and the target audience preferences.",
  "influencerAngle": "string: Explain how the athletes should position themselves in relation to the brand. Include suggestions for authentic endorsement approaches and content styles.",
  "brandMentions": "string: Provide specific guidelines on how and how often the brand should be mentioned in athlete content. Include suggestions for natural product/service integrations.",
  "metrics": "string: List the key performance indicators (KPIs) to measure campaign success, such as engagement rate, conversions, and ROI. Suggest industry-standard tools to track them.",
  "questions": "string: Provide a list of strategic questions businesses should ask to refine their campaign and improve future marketing efforts.",
  "productLaunch": boolean- Specify whether the campaign is focused on launching a new product (true/false).,
  "engagementGoal": integer | null- Estimate the target number of likes, shares, and comments the campaign should aim for.,
  "conversionGoal": integer | null- Estimate the number of expected conversions (sales, sign-ups, etc.).,
  "impressionsGoal": integer | null- Estimate the projected reach in terms of social media impressions.,
  "contentDeliverables": "string | null: List specific content types that will be created (e.g., videos, social media posts, athlete interviews).",
  "eventPromotion": boolean- Specify whether the campaign involves an event (true/false).",
  "csrInitiative": boolean- Specify whether the campaign ties into a social impact initiative (true/false)."
}
Return only JSON. Ensure that all numeric fields are returned as integers and boolean fields are true/false, NOT strings. Return only the JSON object with no extra text or formatting.
`;

const globalForGemini = global as unknown as { geminiModel: ReturnType<typeof initGeminiModel> };

function initGeminiModel() {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) throw new Error("Missing API_KEY in environment variables.");

    const genAI = new GoogleGenerativeAI(API_KEY);
    return genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction,
        generationConfig: {
            responseMimeType: "application/json",
        }
    });
}

export const model = globalForGemini.geminiModel || initGeminiModel();

if (process.env.NODE_ENV !== 'production') globalForGemini.geminiModel = model;
