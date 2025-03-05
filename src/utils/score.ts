import { Campaign, StudentAthlete } from '@prisma/client';

export function calculateMatchScore(campaign: Campaign, athlete: StudentAthlete): number {
    let score = 0;

    if (campaign.sports.includes(athlete.sport)) {
        score += 10;
    }

    // TODO: Add more matching criteria
    // Industry preferences match
    // Marketing style match
    // Compensation type match
    // etc.

    return score;
}
