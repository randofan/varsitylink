'use client';

import { Container, Typography } from '@mui/material';
import SignupPage from "./signup";

export default function Signup() {
    return (
        <Container>
            <Typography variant="h3">Sign up today</Typography>
            <Typography variant="h6">Keep track of campaigns easily</Typography>
            <SignupPage />
        </Container>
    );
};
