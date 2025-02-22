import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { sendConfirmationEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Convert age to number
    data.age = parseInt(data.age, 10);

    await prisma.studentAthlete.create({
      data: {
        name: data.name,
        email: data.email,
        sport: data.sport,
        age: data.age,
        major: data.major,
        gender: data.gender,
        ethnicity: data.ethnicity,
        instagram: data.instagram || null,
        tiktok: data.tiktok || null,
        pinterest: data.pinterest || null,
        linkedIn: data.linkedIn || null,
        xUsername: data.xUsername || null,
        industries: data.industries || [],
        marketingOptions: data.marketingOptions || [],
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
