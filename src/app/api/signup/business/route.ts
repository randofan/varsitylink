import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { sendConfirmationEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Split the data for Business vs. Campaign
    const { name, email, missionStatement, socialLinks, website } = data;
    const { campaignSummary, budget, athletePartnerCount, sports } = data;

    // Convert socialLinks from comma separated to array
    const socialLinksArray = socialLinks.split(',').map((link: string) => link.trim());

    const business = await prisma.business.create({
      data: {
        name,
        email,
        missionStatement,
        socialLinks: socialLinksArray,
        website,
      },
    });

    await prisma.campaign.create({
      data: {
        campaignSummary,
        budget,
        athletePartnerCount,
        sports,
        businessId: business.id,
      },
    });

    // TODO the email function isn't working with nodemailer because of a recent
    // change to auth. See:
    // https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs

    // await sendConfirmationEmail(email);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
