'use client';

import { Container, Typography } from '@mui/material';
import SignupPage from "./signup";

export default function Signup() {
    return (
        <section className="min-h-screen bg-gray-50 flex items-center overflow-y-auto">
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
    );
};
