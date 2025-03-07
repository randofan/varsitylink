'use client';

import { Typography, Container, Box } from '@mui/material';
import Image from 'next/image';
import StudentAthleteCard from '@/components/StudentAthleteCard';
import SignupPage from './signup/signup';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SignupButton from '@/components/SignupButton';
import Header from '@/components/HomeHeader';
import { useAthletes } from '@/hooks/useStudentAthletes';
import { StudentAthlete } from '@prisma/client';
import AnimatedLoader from '@/components/HomeLoading';

export default function Home() {
  const { athletes, loading, error } = useAthletes();

  if (loading) {
    return <AnimatedLoader />;
  }

  if (error) {
    return <div>Error loading athletes</div>;
  }

  return (
    <div>
      <Header />
      <Box
        component="section"
        sx={{
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          py: 6,
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Score Big with AI-Powered NIL Marketing
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Small businesses, Big impact: Partner with student athletes to bring your brand vision to life.
          </Typography>
          <SignupButton />
        </Container>
      </Box>

      {/* Carousel Section */}
      <Box
        component="section"
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          overflowX: 'hidden',
          py: 6,
        }}
      >
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 2 }}>
            Student athletes who represent you
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 3, color: 'grey.600' }}>
            Browse our diverse roster of student athletes sorted by sport, school, or social outreach.
          </Typography>
          <Box sx={{ maxWidth: '100%', overflow: 'hidden', px: 2, position: 'relative' }}>
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              centerMode={false}
              swipeable
              emulateTouch
              showArrows
              autoPlay={false}
              showIndicators={false}
              renderArrowPrev={(clickHandler, hasPrev) =>
                hasPrev && (
                  <button
                    onClick={clickHandler}
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      position: 'absolute',
                      left: '-50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  />
                )
              }
              renderArrowNext={(clickHandler, hasNext) =>
                hasNext && (
                  <button
                    onClick={clickHandler}
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      position: 'absolute',
                      right: '-50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  />
                )
              }
            >
              {/* Group athletes into sets of 3 per slide */}
              {Array.from({ length: Math.ceil(athletes.length / 3) }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 2,
                    px: 2,
                  }}
                >
                  {athletes.slice(i * 3, (i + 1) * 3).map((athlete: StudentAthlete, index: number) => (
                    <Box key={index} sx={{ px: 1 }}>
                      <StudentAthleteCard {...athlete} image={athlete.image || '/default-profile.jpg'} />
                    </Box>
                  ))}
                </Box>
              ))}
            </Carousel>
          </Box>
        </Container>
      </Box>

      {/* Campaign Section */}
      <Box
        component="section"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 6,
        }}
      >
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 2 }}>
            We handle everything
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 3, color: 'grey.600' }}>
            We leverage AI to handle all aspects of a NIL deal including building a captivating campaign and finding the right talent for your business.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" sx={{ color: 'grey.600' }}>
              With your Mission Statement, Business Objectives and Campaign Budget, we are able to create a full campaign for you in minutes.
              All you have to do is approve the Campaign Proposal and select from the shortlisted student athletes to work with.
            </Typography>
            <Box sx={{ position: 'relative', height: 500 }}>
              <Image
                src="/ai_campaign.png"
                alt="AI Platform"
                fill
                style={{ objectFit: 'contain', borderRadius: '8px' }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Signup Section */}
      <Box
        component="section"
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          py: 6,
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" align="center" sx={{ mb: 2 }}>
              Sign up today
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 3, color: 'grey.600' }}>
              Keep track of campaigns easily
            </Typography>
            <Box sx={{ maxWidth: 800, width: '100%' }}>
              <SignupPage />
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
