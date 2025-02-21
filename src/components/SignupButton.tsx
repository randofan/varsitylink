import { Button } from '@mui/material';
import Link from 'next/link';

export default function SignupButton() {
    return (
        <Button 
            variant="contained" 
            sx={{ backgroundColor: '#4767F5', '&:hover': { backgroundColor: '#3451d1' } }}
        >
            <Link href="/signup" passHref>
                Sign Up
            </Link>
        </Button>
    );
}