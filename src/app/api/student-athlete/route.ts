import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { uploadToS3 } from '@/utils/uploadToS3';
import { MarketingOptions, Compensations } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // Parse form data (multipart/form-data)
    const formData = await request.formData();

    // Extract file and other form fields
    const imageFile = formData.get('image') as File | null;

    // Process image upload if file exists
    let imageUrl: string | null = null;
    if (imageFile) {
      // Convert file to buffer for S3 upload
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadToS3(buffer, imageFile.name, imageFile.type);
    }

    // Process form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const sport = formData.get('sport') as string;
    const age = parseInt(formData.get('age') as string);
    const major = formData.get('major') as string;
    const gender = formData.get('gender') as string;
    const ethnicity = formData.get('ethnicity') as string;
    const instagram = formData.get('instagram') as string || undefined;
    const tiktok = formData.get('tiktok') as string || undefined;
    const pinterest = formData.get('pinterest') as string || undefined;
    const linkedIn = formData.get('linkedIn') as string || undefined;
    const twitter = formData.get('twitter') as string || undefined;
    const introBlurb = formData.get('introBlurb') as string || undefined;

    // Get array values
    const industries = formData.getAll('industries[]').map(item => item.toString());
    const marketingOptions = formData.getAll('marketingOptions[]')
      .map(item => item.toString() as MarketingOptions);
    const compensation = formData.getAll('compensation[]')
      .map(item => item.toString() as Compensations);

    // Optional hours per week
    const hoursPerWeek = formData.get('hoursPerWeek')
      ? parseInt(formData.get('hoursPerWeek') as string)
      : undefined;

    // Create student athlete record with image URL
    await prisma.studentAthlete.create({
      data: {
        name,
        email,
        image: imageUrl,
        age,
        sport,
        major,
        gender,
        ethnicity,
        introBlurb,
        instagram,
        tiktok,
        pinterest,
        linkedIn,
        twitter,
        industries,
        marketingOptions,
        hoursPerWeek,
        compensation,
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
      console.log('**athlete:', athlete);
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
