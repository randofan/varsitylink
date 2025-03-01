'use client';

import { Box, Typography, keyframes } from '@mui/material';
import { useState, useEffect } from 'react';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const AnimatedLoader = () => {
    const [loadingText, setLoadingText] = useState('Loading athletes');

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText(current => {
                if (current === 'Loading athletes...') return 'Loading athletes';
                if (current === 'Loading athletes..') return 'Loading athletes...';
                if (current === 'Loading athletes.') return 'Loading athletes..';
                return 'Loading athletes.';
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#ffffff',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                {/* Animated circle loader */}
                <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: '4px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '50%',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: '4px solid transparent',
                            borderTopColor: 'primary.main',
                            borderRadius: '50%',
                            animation: `${spin} 1s linear infinite`,
                        }}
                    />
                </Box>

                {/* Pulsing athlete icon */}
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: `${pulse} 1.5s ease-in-out infinite`,
                        mb: 2,
                    }}
                >
                    {/* You can replace this with an actual athlete icon SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,6c1.93,0,3.5,1.57,3.5,3.5S13.93,13,12,13s-3.5-1.57-3.5-3.5S10.07,6,12,6z M12,20c-2.03,0-4.43-0.82-6.14-2.88C7.55,15.8,9.68,15,12,15s4.45,0.8,6.14,2.12C16.43,19.18,14.03,20,12,20z" />
                    </svg>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                    {loadingText}
                </Typography>
            </Box>
        </Box>
    );
};

export default AnimatedLoader;