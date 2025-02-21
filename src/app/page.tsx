'use client';

import { Typography, Container } from '@mui/material';
import Image from 'next/image';
import { athletes } from '@/utils/athletes';
import AthleteCard from '@/components/AthleteCard';
import SignupPage from './signup/signup';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AthleteCardProps } from '@/utils/types';
import SignupButton from '@/components/SignupButton';
import { Key } from 'react';

export default function Home() {
  return (
    <main>
      <section className="min-h-screen my-16 bg-white text-black flex items-center overflow-y-auto">
        <Container maxWidth="lg" className="text-center mx-auto py-20 px-14">
          <Typography variant="h1" className="font-bold mb-4">
        Score Big with AI-Powered NIL Marketing
          </Typography>
          <Typography variant="h5" className="mb-8">
        Small businesses, Big impact: Partner with student athletes to bring your brand vision to life.
          </Typography>
          <SignupButton />
        </Container>
      </section>

      <section className="min-h-screen my-16 bg-gray-50 flex items-center overflow-y-auto">
        <Container className="py-20">
          <Typography variant="h3" className="text-center mb-8">
            Student athletes who represent you
          </Typography>
          <Typography variant="h6" className="text-center mb-12 text-gray-600">
            Browse our diverse roster of student athletes sorted by sport, school, or social outreach.
          </Typography>
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            centerMode
            centerSlidePercentage={33}
          >
            {athletes.map((athlete: AthleteCardProps, index: Key) => (
              <AthleteCard key={index} {...athlete} />
            ))}
          </Carousel>
        </Container>
      </section>

      <section className="min-h-screen my-16 flex items-center overflow-y-auto">
        <Container className="py-20">
          <Typography variant="h3" className="text-center mb-8">
            We handle everything
          </Typography>
          <Typography variant="h6" className="text-center mb-12 text-gray-600">
            We leverage AI to handle all aspects of a NIL deal including building a captivating campaign and finding the right talent for your business.
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Typography variant="body1" className='text-gray-600'>
                With your Mission Statement, Business Objectives and Campaign Budget, we are able to create a full campaign for you in minutes.

                All you have to do is approve the Campaign Proposal and select from the shortlisted student athletes to work with.              </Typography>
            </div>
            <div className="relative h-[500px]">
              <Image
                src="/ai_campaign.png"
                alt="AI Platform"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="min-h-screen my-16 bg-gray-50 flex items-center overflow-y-auto">
        <Container className="py-20">
          <div className="flex flex-col items-center justify-center">
            <Typography variant="h3" className="text-center mb-4">
              Sign up today
            </Typography>
            <Typography variant="h6" className="text-center mb-8 text-gray-600">
              Keep track of campaigns easily
            </Typography>
            <div className="max-w-2xl w-full">
              <SignupPage />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
