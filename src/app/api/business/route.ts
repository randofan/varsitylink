import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      name,
      email,
      missionStatement,
      instagram,
      tiktok,
      pinterest,
      linkedIn,
      twitter,
      website,
    } = data;

    const business = await prisma.business.create({
      data: {
        name,
        email,
        missionStatement,
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
        pinterest: pinterest || undefined,
        linkedIn: linkedIn || undefined,
        twitter: twitter || undefined,
        website: website || undefined,
      },
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const business = await prisma.business.findUnique({
        where: { id: parseInt(id) },
        include: {
          campaigns: {
            include: {
              studentAthletes: true
            }
          }
        }
      });
      return NextResponse.json(business);
    }

    const businesses = await prisma.business.findMany({
      include: {
        campaigns: {
          include: {
            studentAthletes: true
          }
        }
      }
    });
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Failed to fetch businesses:', error);
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
  }
}
