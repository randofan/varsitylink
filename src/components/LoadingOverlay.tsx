// LoadingOverlay.tsx
import { Box, Typography, keyframes } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

// Define the props interface
interface LoadingOverlayProps {
    isVisible: boolean;
    onComplete: () => void;
    apiCallComplete: boolean; // New prop to indicate when the API call is complete
}

// Create pulse animation
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

// Create rotate animation for the spinner
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, onComplete, apiCallComplete }) => {
    const [message, setMessage] = useState<string>("Understanding business profile");
    const [progressValue, setProgressValue] = useState<number>(0);
    const minimumTimeElapsedRef = useRef<boolean>(false);

    // Handle the progress counter (0-100%)
    useEffect(() => {
        let progressInterval: NodeJS.Timeout | undefined;

        if (isVisible) {
            // Set up progress interval to reach 100% in 5 seconds
            progressInterval = setInterval(() => {
                setProgressValue(prev => {
                    // If we're at 100%, just stay there
                    if (prev >= 100) {
                        return 100;
                    }

                    // If API is complete but we're not at 100%, speed up to reach 100 quickly
                    if (apiCallComplete && prev < 90) {
                        return prev + 2; // Speed up progress
                    }

                    // Standard progress speed - designed to reach ~95% at 10 seconds
                    // We're updating every 50ms, so to reach ~95% in 10 seconds (10000ms):
                    // 95 steps ÷ (10000ms ÷ 50ms) = 95 ÷ 200 = 0.475 per step
                    // Rounded to 0.5 for simplicity
                    const newValue = prev + (apiCallComplete ? 2 : 0.5);
                    return Math.min(newValue, apiCallComplete ? 100 : 95);
                });
            }, 50);
        }

        return () => {
            clearInterval(progressInterval);
        };
    }, [isVisible, apiCallComplete]);

    // Handle the message change and minimum time tracking
    useEffect(() => {
        let messageTimer: NodeJS.Timeout | undefined;
        let minimumTimeTimer: NodeJS.Timeout | undefined;

        if (isVisible) {
            // Change message after 7.5 seconds
            messageTimer = setTimeout(() => {
                setMessage("Generating a campaign");
            }, 7500);

            // Set minimum time elapsed flag after 15 seconds
            minimumTimeTimer = setTimeout(() => {
                minimumTimeElapsedRef.current = true;
                // If API is already complete, we can trigger onComplete
                if (apiCallComplete) {
                    onComplete();
                }
            }, 15000);
        }

        return () => {
            clearTimeout(messageTimer);
            clearTimeout(minimumTimeTimer);
        };
    }, [isVisible, apiCallComplete, onComplete]);

    // Check if we can complete the loading state
    useEffect(() => {
        // Only proceed if:
        // 1. The overlay is visible
        // 2. The minimum 5 seconds have elapsed
        // 3. The API call is complete
        if (isVisible && minimumTimeElapsedRef.current && apiCallComplete) {
            // Give a small delay to ensure the progress bar reaches 100%
            const finalTimer = setTimeout(() => {
                onComplete();
            }, 500);

            return () => clearTimeout(finalTimer);
        }
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
            {/* Custom spinner */}
            <Box
                sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Outer rotating circle */}
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

                {/* Inner rotating circle (opposite direction) */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        border: '3px solid transparent',
                        borderLeftColor: '#4767F5',
                        borderRightColor: '#4767F5',
                        animation: `${rotate} 1.5s linear infinite reverse`,
                    }}
                />

                {/* Pulsing center circle */}
                <Box
                    sx={{
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
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        {Math.round(progressValue)}%
                    </Typography>
                </Box>
            </Box>

            {/* Message */}
            <Typography
                variant="h5"
                sx={{
                    mt: 4,
                    fontWeight: 500,
                    color: '#333',
                    textAlign: 'center',
                    fontFamily: '"Poppins", sans-serif',
                    letterSpacing: '0.5px',
                    maxWidth: '80%',
                    opacity: 0.9,
                }}
            >
                {message}
            </Typography>

            {/* Progress bar */}
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
};

export default LoadingOverlay;
