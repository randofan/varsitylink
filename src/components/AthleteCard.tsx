import Image from 'next/image';
import { Card, CardContent, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote';
import { AthleteCardProps } from '@/utils/types';


export default function AthleteCard({ name, sport, image, social }: AthleteCardProps) {
    return (
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            margin: '8px',
            minHeight: '400px' 
        }}>
            <div className="relative h-64 w-full">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
            <CardContent>
                <Typography variant="h6" className="font-bold">
                    {name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {sport}
                </Typography>

                {social.instagram && (
                    <div className="flex items-center gap-2 mt-2">
                        <InstagramIcon className="text-gray-600" />
                        <Typography variant="body2">
                            @{social.instagram.username} • {social.instagram.followers}k
                        </Typography>
                    </div>
                )}
                {social.tiktok && (
                    <div className="flex items-center gap-2 mt-2">
                        <TikTokIcon className="text-gray-600" />
                        <Typography variant="body2">
                            @{social.tiktok.username} • {social.tiktok.followers}k
                        </Typography>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
