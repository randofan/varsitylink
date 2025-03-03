'use client';

import { Container, Typography } from '@mui/material';
import SignupPage from "./signup";
import Header from '@/components/Header';

export default function Signup() {
    return (
        <Container>
            <Header />
            <Typography variant="h3">Sign up today</Typography>
            <Typography variant="h6">Keep track of campaigns easily</Typography>
            <SignupPage />
        </Container>
    );
};
