import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { calculateMatchScore } from '@/utils/score';

export async function POST(request: Request) {
    try {
        const { campaign } = await request.json();

        if (!campaign) {
            return NextResponse.json(
                { error: 'Campaign not found' },
                { status: 404 }
            );
        }

        const athletes = await prisma.studentAthlete.findMany();

        console.log('Matching athletes:', athletes);

        const matchedAthletes = athletes
            .map((athlete) => ({
            athlete,
            score: calculateMatchScore(campaign, athlete),
            }))
            .sort((a, b) => b.score - a.score)
            .map(({ athlete }) => athlete );
        console.log('Matched athletes:', matchedAthletes);

        return NextResponse.json({ matches: matchedAthletes }, { status: 200 });
    } catch (error) {
        console.error('Failed to match athletes:', error);
        return NextResponse.json(
            { error: 'Failed to match athletes' },
            { status: 500 }
        );
    }
}
