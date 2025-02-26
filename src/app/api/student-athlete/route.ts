import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    await prisma.studentAthlete.create({
      data: {
        name: data.name,
        email: data.email,
        image: data.image || undefined,
        age: parseInt(data.age),
        sport: data.sport,
        major: data.major,
        gender: data.gender,
        ethnicity: data.ethnicity,
        introBlurb: data.introBlurb || undefined,

        // Social media
        instagram: data.instagram || undefined,
        tiktok: data.tiktok || undefined,
        pinterest: data.pinterest || undefined,
        linkedIn: data.linkedIn || undefined,
        twitter: data.twitter || undefined,

        // Campaign preferences
        industries: data.industries || [],
        marketingOptions: data.marketingOptions || [],
        hoursPerWeek: data.hoursPerWeek ? parseInt(data.hoursPerWeek) : undefined,
        compensation: data.compensation || [],
      },
    });

    return NextResponse.json({ message: 'Success' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sport = searchParams.get('sport');

    if (id) {
      const athlete = await prisma.studentAthlete.findUnique({
        where: { id: parseInt(id) },
        include: { campaigns: true }
      });
      return NextResponse.json(athlete);
    }

    if (sport) {
      const athletes = await prisma.studentAthlete.findMany({
        where: { sport },
        include: { campaigns: true }
      });
      return NextResponse.json(athletes);
    }

    const athletes = await prisma.studentAthlete.findMany({
      include: { campaigns: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(athletes);
  } catch (error) {
    console.error('Failed to fetch athletes:', error);
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 });
  }
}
