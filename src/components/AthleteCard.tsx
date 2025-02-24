import Image from 'next/image';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
            <Box sx={{ position: 'relative', height: '256px', width: '100%' }}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </Box>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {sport}
                </Typography>

                {social.instagram && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <InstagramIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">
                            @{social.instagram.username} • {social.instagram.followers}k
                        </Typography>
                    </Box>
                )}
                {social.tiktok && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <TikTokIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">
                            @{social.tiktok.username} • {social.tiktok.followers}k
                        </Typography>
                    </Box>
                )}
            </CardContent >
        </Card >
    );
}
