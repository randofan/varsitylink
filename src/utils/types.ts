export interface AthleteCardProps {
    name: string;
    sport: string;
    image: string;
    social: {
        instagram?: { username: string; followers: number };
        twitter?: { username: string; followers: number };
        tiktok?: { username: string; followers: number };
    };
}