// LoadingOverlay.tsx
import { Box, Typography, keyframes } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

// Define the props interface
interface LoadingOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  apiCallComplete: boolean;
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
  const startTimeRef = useRef<number>(0);
  const minimumTimePassed = useRef<boolean>(false);
  const completionHandled = useRef<boolean>(false);
  
  // Reset state when visibility changes
  useEffect(() => {
    if (isVisible) {
      setProgressValue(0);
      setMessage("Understanding business profile");
      startTimeRef.current = Date.now();
      minimumTimePassed.current = false;
      completionHandled.current = false;
    }
  }, [isVisible]);

  // Handle progress updates
  useEffect(() => {
    if (!isVisible) return;
    
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      
      // Check if minimum time has passed (10 seconds)
      if (elapsedTime >= 10000 && !minimumTimePassed.current) {
        minimumTimePassed.current = true;
        
        // If API is also complete, we can finish
        if (apiCallComplete && !completionHandled.current) {
          completionHandled.current = true;
          clearInterval(progressInterval);
          setProgressValue(100);
          setTimeout(onComplete, 500); // Small delay for smooth transition to 100%
          return;
        }
      }
      
      // Update progress value
      setProgressValue(prev => {
        // If we're already at 100%, stay there
        if (prev >= 100) return 100;
        
        // If API call is complete and minimum time passed, quickly reach 100%
        if (apiCallComplete && minimumTimePassed.current) {
          const newValue = prev + 5; // Fast completion
          if (newValue >= 100 && !completionHandled.current) {
            completionHandled.current = true;
            setTimeout(onComplete, 500);
          }
          return Math.min(newValue, 100);
        }
        
        // If API call is complete but min time not passed, go to 95% max
        if (apiCallComplete) {
          return Math.min(prev + 0.8, 95);
        }
        
        // Normal progress: calculate based on elapsed time (0-95% over 10 seconds)
        const targetProgress = Math.min((elapsedTime / 10000) * 95, 95);
        // Smooth approach to target
        return prev + Math.max(0.1, (targetProgress - prev) * 0.1);
      });
    }, 50);
    
    return () => clearInterval(progressInterval);
  }, [isVisible, apiCallComplete, onComplete]);
  
  // Handle message change
  useEffect(() => {
    if (!isVisible) return;
    
    const messageTimer = setTimeout(() => {
      setMessage("Generating a campaign");
    }, 5000); // Change message after 5 seconds
    
    return () => clearTimeout(messageTimer);
  }, [isVisible]);
  
  // Safety timeout - don't let loading go beyond 15 seconds total
  useEffect(() => {
    if (!isVisible) return;
    
    const safetyTimeout = setTimeout(() => {
      if (!completionHandled.current) {
        completionHandled.current = true;
        setProgressValue(100);
        setTimeout(onComplete, 500);
      }
    }, 15000);
    
    return () => clearTimeout(safetyTimeout);
  }, [isVisible, onComplete]);
  
  // Watch for API completion after minimum time has passed
  useEffect(() => {
    if (isVisible && apiCallComplete && minimumTimePassed.current && !completionHandled.current) {
      completionHandled.current = true;
      setProgressValue(prev => Math.min(prev + 5, 100));
      setTimeout(onComplete, 500);
    }
  }, [apiCallComplete, isVisible, onComplete]);
  
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
