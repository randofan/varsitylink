"use client";

import { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper
} from '@mui/material';
import { useForm } from 'react-hook-form';

interface CampaignFormData {
    campaignSummary: string;
    budget: string;
    athletePartnerCount: string;
    sports: string[];
    customSport?: string;
}

interface GeneratedCampaign {
    objectives: string;
    targetAudience: string;
    channels: string;
    timeline: string;
    budgetBreakdown: string;
    creativeConcept: string;
    metrics: string;
}

export default function SignupWizard() {
    const [step, setStep] = useState(1);
    const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
    const { register, handleSubmit } = useForm<CampaignFormData>();

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const onSubmit = async (data: CampaignFormData) => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to generate campaign');

            const result = await response.json();
            setGeneratedCampaign(result.draftCampaign);
            nextStep();
        } catch (error) {
            console.error('Error generating campaign:', error);
            alert('Failed to generate campaign. Please try again.');
        }
    };

    const sportOptions = ['Football', 'Basketball', 'Soccer', 'Baseball', 'Other'];
    const partnerCountOptions = ['1', '2', '3', '4', '5', '6', 'any'];

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Create a new campaign
            </Typography>

            {step === 1 && (
                <Paper sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Campaign Summary"
                                multiline
                                rows={4}
                                {...register('campaignSummary', { required: true })}
                                placeholder="Describe your campaign objectives and goals"
                            />

                            <TextField
                                label="Budget"
                                {...register('budget', { required: true })}
                                placeholder="e.g., $5000"
                            />

                            <FormControl fullWidth>
                                <InputLabel>Athlete Partner Count</InputLabel>
                                <Select
                                    label="Athlete Partner Count"
                                    defaultValue=""
                                    {...register('athletePartnerCount', { required: true })}
                                >
                                    {partnerCountOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option === 'any' ? 'Any number of athletes' : `${option} athlete${option === '1' ? '' : 's'}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Sports</InputLabel>
                                <Select
                                    multiple
                                    label="Sports"
                                    {...register('sports', { required: true })}
                                >
                                    {sportOptions.map((sport) => (
                                        <MenuItem key={sport} value={sport}>
                                            {sport}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: '#4767F5',
                                    '&:hover': { bgcolor: '#3852c4' }
                                }}
                            >
                                Generate Campaign
                            </Button>
                        </Box>
                    </form>
                </Paper>
            )}

            {step === 2 && generatedCampaign && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>Generated Campaign Strategy</Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Object.entries(generatedCampaign).map(([key, value]) => (
                            <Box key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="h6" color="primary">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            const newValue = prompt("Edit " + key, value);
                                            if (newValue) {
                                                setGeneratedCampaign({
                                                    ...generatedCampaign,
                                                    [key]: newValue
                                                });
                                            }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                                <Typography>{value}</Typography>
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button onClick={prevStep} variant="outlined">
                                Back to Edit
                            </Button>
                            <Button
                                onClick={nextStep}
                                variant="contained"
                                sx={{
                                    bgcolor: '#4767F5',
                                    '&:hover': { bgcolor: '#3852c4' }
                                }}
                            >
                                Continue
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}
            {step === 3 && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>Review and Submit</Typography>
                    <Typography>Review your campaign strategy and submit it for approval.</Typography>
                    <Button
                        onClick={nextStep}
                        variant="contained"
                        sx={{
                            bgcolor: '#4767F5',
                            '&:hover': { bgcolor: '#3852c4' },
                            mt: 2
                        }}
                    >
                        Submit Campaign
                    </Button>
                </Paper>
            )}
            {step === 4 && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>Campaign Created Successfully!</Typography>
                    <Typography>Your campaign has been successfully created.</Typography>
                </Paper>
            )}
        </Box>
    );
}