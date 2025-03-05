import { Box, Typography, keyframes } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';

interface MatchingOverlayProps {
    isVisible: boolean;
    onComplete: () => void;
    apiCallComplete: boolean;
}

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(71, 103, 245, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(71, 103, 245, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(71, 103, 245, 0);
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function MatchingOverlay({ isVisible, onComplete, apiCallComplete }: MatchingOverlayProps) {
    const [progressValue, setProgressValue] = useState(0);
    const startTimeRef = useRef(Date.now());
    const completionHandled = useRef(false);

    useEffect(() => {
        if (!isVisible) return;

        startTimeRef.current = Date.now();
        completionHandled.current = false;
        setProgressValue(0);

        const progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTimeRef.current;

            if (apiCallComplete && elapsedTime >= 2000) {
                if (!completionHandled.current) {
                    completionHandled.current = true;
                    setProgressValue(100);
                    setTimeout(onComplete, 500);
                }
                return;
            }

            setProgressValue(prev => {
                if (prev >= 100) return 100;
                if (apiCallComplete) return Math.min(prev + 5, 100);
                return Math.min(prev + 1, 95);
            });
        }, 50);

        // Safety timeout after 10 seconds
        const safetyTimeout = setTimeout(() => {
            if (!completionHandled.current) {
                completionHandled.current = true;
                setProgressValue(100);
                setTimeout(onComplete, 500);
            }
        }, 10000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(safetyTimeout);
        };
    }, [isVisible, apiCallComplete, onComplete]);

    if (!isVisible) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(5px)',
                zIndex: 9999,
            }}
        >
            <Box sx={{ position: 'relative', width: 120, height: 120, mb: 4 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        border: '3px solid transparent',
                        borderTopColor: '#4767F5',
                        borderBottomColor: '#4767F5',
                        animation: `${rotate} 2s linear infinite`,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        width: 90,
                        height: 90,
                        top: '15px',
                        left: '15px',
                        borderRadius: '50%',
                        border: '3px solid transparent',
                        borderLeftColor: '#4767F5',
                        borderRightColor: '#4767F5',
                        animation: `${rotate} 1.5s linear infinite reverse`,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '35px',
                        left: '35px',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: '#4767F5',
                        opacity: 0.8,
                        animation: `${pulse} 1.5s infinite`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                        {Math.round(progressValue)}%
                    </Typography>
                </Box>
            </Box>

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 500,
                    color: '#333',
                    textAlign: 'center',
                    maxWidth: '80%',
                }}
            >
                Finding best student-athlete matches
            </Typography>

            <Box
                sx={{
                    width: 300,
                    height: 4,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 2,
                    mt: 3,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${progressValue}%`,
                        backgroundColor: '#4767F5',
                        borderRadius: 2,
                        transition: 'width 0.1s linear',
                    }}
                />
            </Box>
        </Box>
    );
}
