"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    TextField,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardContent,
    FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';
import StudentAthleteCard from '@/components/StudentAthleteCard';
import { CampaignFormData, sportsOptions } from '@/utils/types';
import { StudentAthlete, Campaign, Compensations } from '@prisma/client';
import LoadingOverlay from '@/components/LoadingOverlay';
import MatchingOverlay from '@/components/MatchingOverlay';

export default function SignupWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [athletes, setAthletes] = useState<StudentAthlete[]>([]);
    const [selectedAthletes, setSelectedAthletes] = useState<StudentAthlete[]>([]);
    const [generatedCampaign, setGeneratedCampaign] = useState<Campaign | null>(null);
    const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false);
    const [apiCallComplete, setApiCallComplete] = useState(false);
    const [matchingOverlayVisible, setMatchingOverlayVisible] = useState(false);
    const [matchingApiComplete, setMatchingApiComplete] = useState(false);

    const nextStep = async () => {
        if (step === 2) {
            setMatchingOverlayVisible(true);
            setMatchingApiComplete(false);

            try {
                // Call your athlete matching API here
                const response = await fetch('/api/match-athletes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ campaign: generatedCampaign }),
                });

                if (!response.ok) throw new Error('Failed to match athletes');
                const data = await response.json();

                // Update your athletes state with the matched athletes
                setAthletes(data.matches);
                setMatchingApiComplete(true);
            } catch (error) {
                console.error('Error matching athletes:', error);
                setMatchingOverlayVisible(false);
                setError('Failed to match athletes');
            }
        } else {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const { control, handleSubmit } = useForm<CampaignFormData>({
        defaultValues: {
            name: '',
            campaignSummary: '',
            maxBudget: '',
            compensation: Compensations.FixedFee,
            studentAthleteCount: '3',
            sports: [],
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            businessId: 1  // Hardcoded business ID
        }
    });

    // Initialize and fetch athletes
    useEffect(() => {
        const fetchAthletes = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/student-athlete');
                if (!response.ok) throw new Error('Failed to fetch athletes');
                const data = await response.json();
                setAthletes(data);
            } catch (err) {
                setError('Failed to fetch athletes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAthletes();
    }, []);

    // Initialize selectedAthletes when we reach step 3
    useEffect(() => {
        // Only initialize selectedAthletes when we have athletes loaded and a generated campaign
        if (athletes.length > 0 && generatedCampaign && step === 3) {
            // Get the number of athletes to select based on the campaign
            const count = generatedCampaign.studentAthleteCount || 3;
            // Use only the number of athletes requested or available
            const initialSelection = athletes.slice(0, count);
            setSelectedAthletes(initialSelection);
        }
    }, [athletes, generatedCampaign, step]);

    // Handler for when the loading overlay completes
    const handleLoadingComplete = () => {
        setLoadingOverlayVisible(false);
        setApiCallComplete(false); // Reset for next time
        // Only move to the next step if we have a generated campaign
        if (generatedCampaign) {
            nextStep();
        }
    };

    const handleMatchingComplete = () => {
        setMatchingOverlayVisible(false);
        setMatchingApiComplete(false);
        setStep(step + 1);
    };

    const onSubmitForm = async (data: CampaignFormData) => {
        setLoading(true);
        setError(null);
        setApiCallComplete(false); // Reset API call status
        setLoadingOverlayVisible(true); // Show the loading overlay

        try {
            // Make API call
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to generate campaign');

            const result = await response.json();
            setGeneratedCampaign(result.campaign); // Updated to match our API response structure

            // Signal that the API call is complete, but don't hide the overlay yet
            setApiCallComplete(true);

            // Note: We don't call nextStep() here anymore as the loading overlay handles it
        } catch (err) {
            console.error('Error generating campaign:', err);
            setError('Failed to generate campaign. Please try again.');
            setLoadingOverlayVisible(false); // Hide overlay on error
        } finally {
            setLoading(false);
            // Note: Don't hide the overlay here - it will hide when both minimum time elapsed AND API call complete
        }
    };

    const submitFinalCampaign = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!generatedCampaign) throw new Error('No campaign data');

            const finalCampaign = {
                ...generatedCampaign,
                studentAthletes: selectedAthletes
            };

            console.log(finalCampaign)

            const response = await fetch('/api/campaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalCampaign),
            });

            if (!response.ok) throw new Error('Failed to create campaign');

            const result = await response.json();
            const campaignId = result.campaign?.id;
            router.push(`/business/campaigns/${campaignId}`);
        } catch (err) {
            console.error('Error creating campaign:', err);
            setError('Failed to create campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateCampaignField = (field: string, value: unknown) => {
        if (!generatedCampaign) return;
        setGeneratedCampaign({
            ...generatedCampaign,
            [field]: value
        });
    };

    const remainingAthletes = useMemo(() => {
        if (!athletes.length) return [];
        return athletes.filter(athlete =>
            !selectedAthletes.some(selected => selected.id === athlete.id)
        );
    }, [athletes, selectedAthletes]);

    const replaceAthlete = (index: number) => {
        if (remainingAthletes.length === 0) return;

        // Find the next athlete who isn't already selected
        const newAthlete = remainingAthletes[0];

        setSelectedAthletes(prev => {
            const updated = [...prev];
            updated[index] = newAthlete;
            return updated;
        });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>Campaign Details</Typography>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Campaign name is required' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Campaign Name"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="campaignSummary"
                                    control={control}
                                    rules={{ required: 'Campaign summary is required' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Campaign Summary"
                                            multiline
                                            rows={4}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            placeholder="Describe your campaign objectives and goals"
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="maxBudget"
                                    control={control}
                                    rules={{ required: 'Budget is required' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Maximum Budget"
                                            placeholder="e.g., $5000 or 'Free Product'"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="compensation"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Compensation Type</InputLabel>
                                            <Select
                                                {...field}
                                                label="Compensation Type"
                                            >
                                                {Object.values(Compensations).map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="studentAthleteCount"
                                    control={control}
                                    rules={{ required: 'Number of athletes is required' }}
                                    render={({ field, fieldState }) => (
                                        <FormControl fullWidth error={!!fieldState.error}>
                                            <InputLabel>Student Athlete Count</InputLabel>
                                            <Select
                                                {...field}
                                                label="Student Athlete Count"
                                            >
                                                {['1', '2', '3', '4', '5', '6', 'any'].map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option === 'any' ? 'Any number of athletes' : `${option} athlete${option === '1' ? '' : 's'}`}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="sports"
                                    control={control}
                                    rules={{ required: 'At least one sport is required' }}
                                    render={({ field, fieldState }) => (
                                        <FormControl fullWidth error={!!fieldState.error}>
                                            <InputLabel>Sports</InputLabel>
                                            <Select
                                                {...field}
                                                multiple
                                                label="Sports"
                                            >
                                                {sportsOptions.map((sport) => (
                                                    <MenuItem key={sport} value={sport}>
                                                        {sport}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                        </FormControl>
                                    )}
                                />

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="startDate"
                                                control={control}
                                                rules={{ required: 'Start date is required' }}
                                                render={({ field, fieldState }) => (
                                                    <DatePicker
                                                        label="Start Date"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!fieldState.error,
                                                                helperText: fieldState.error?.message
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="endDate"
                                                control={control}
                                                rules={{ required: 'End date is required' }}
                                                render={({ field, fieldState }) => (
                                                    <DatePicker
                                                        label="End Date"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!fieldState.error,
                                                                helperText: fieldState.error?.message
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        bgcolor: '#4767F5',
                                        '&:hover': { bgcolor: '#3852c4' },
                                        mt: 2
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Generate Campaign'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                );

            case 2:
                return generatedCampaign ? (
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>Generated Campaign Strategy</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Review and edit the generated campaign details before proceeding
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {Object.entries(generatedCampaign).map(([key, value]) => {
                                // Skip certain fields
                                if (['id', 'status', 'createdAt', 'businessId', 'studentAthletes'].includes(key)) {
                                    return null;
                                }

                                const formattedKey = key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, (str) => str.toUpperCase());

                                return (
                                    <Card key={key} variant="outlined" sx={{ p: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                {formattedKey}
                                            </Typography>

                                            {/* For string values */}
                                            {typeof value === 'string' &&
                                                !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value) && (
                                                    <TextField
                                                        value={value}
                                                        onChange={(e) => updateCampaignField(key, e.target.value)}
                                                        multiline={value.length > 50}
                                                        rows={value.length > 100 ? 4 : 2}
                                                        fullWidth
                                                    />
                                                )}

                                            {/* For number values */}
                                            {typeof value === 'number' && (
                                                <TextField
                                                    type="number"
                                                    value={value}
                                                    onChange={(e) => updateCampaignField(key, Number(e.target.value))}
                                                    fullWidth
                                                />
                                            )}

                                            {/* For boolean values */}
                                            {typeof value === 'boolean' && (
                                                <FormControl fullWidth>
                                                    <InputLabel id={`${key}-label`}>Value</InputLabel>
                                                    <Select
                                                        labelId={`${key}-label`}
                                                        value={value ? "true" : "false"}
                                                        onChange={(e) => updateCampaignField(key, e.target.value === "true")}
                                                        label="Value"
                                                    >
                                                        <MenuItem value="true">Yes</MenuItem>
                                                        <MenuItem value="false">No</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}

                                            {/* For array values */}
                                            {Array.isArray(value) && (
                                                <TextField
                                                    value={value.join(', ')}
                                                    onChange={(e) => updateCampaignField(key, e.target.value.split(',').map(item => item.trim()))}
                                                    helperText="Separate items with commas"
                                                    fullWidth
                                                />
                                            )}

                                            {/* For date values */}
                                            {value instanceof Date && (
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        value={new Date(value)}
                                                        onChange={(newDate) => updateCampaignField(key, newDate)}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            )}

                                            {/* For date strings */}
                                            {typeof value === 'string' &&
                                                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value) && (
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DatePicker
                                                            value={new Date(value)}
                                                            onChange={(newDate) => updateCampaignField(key, newDate ? newDate.toISOString() : null)}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true
                                                                }
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                )}
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
                                <Button
                                    onClick={prevStep}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={nextStep}
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#4767F5',
                                        '&:hover': { bgcolor: '#3852c4' }
                                    }}
                                >
                                    Continue to Athlete Selection
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                ) : (
                    <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Paper>
                );

            case 3:
                return (
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>Select Athletes</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Review and customize your athlete selections
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    {selectedAthletes.map((athlete, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={athlete.id}>
                                            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <StudentAthleteCard {...athlete} />
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => replaceAthlete(index)}
                                                    disabled={remainingAthletes.length === 0}
                                                    sx={{ mt: 2 }}
                                                    fullWidth
                                                >
                                                    Replace Athlete
                                                </Button>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                    <Button onClick={prevStep} variant="outlined">
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        variant="contained"
                                        disabled={selectedAthletes.length === 0}
                                        sx={{
                                            bgcolor: '#4767F5',
                                            '&:hover': { bgcolor: '#3852c4' }
                                        }}
                                    >
                                        Continue to Review
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Paper>
                );

            case 4:
                return generatedCampaign ? (
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>Campaign Review</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Review your campaign details before final submission
                        </Typography>

                        <Card variant="outlined" sx={{ mb: 4, p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {generatedCampaign.name}
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Campaign Summary</Typography>
                                    <Typography variant="body2" paragraph>
                                        {generatedCampaign.campaignSummary}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Budget & Compensation</Typography>
                                    <Typography variant="body2">
                                        Max Budget: {generatedCampaign.maxBudget}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Compensation Type: {generatedCampaign.compensation}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Timeline</Typography>
                                    <Typography variant="body2">
                                        Start: {new Date(generatedCampaign.startDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        End: {new Date(generatedCampaign.endDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Sports</Typography>
                                    <Typography variant="body2" paragraph>
                                        {generatedCampaign.sports.join(', ')}
                                    </Typography>
                                </Grid>

                                {/* Display new AI generated fields */}
                                {generatedCampaign.brandTone && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Brand Tone</Typography>
                                        <Typography variant="body2" paragraph>
                                            {generatedCampaign.brandTone}
                                        </Typography>
                                    </Grid>
                                )}

                                {generatedCampaign.influencerAngle && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Influencer Angle</Typography>
                                        <Typography variant="body2" paragraph>
                                            {generatedCampaign.influencerAngle}
                                        </Typography>
                                    </Grid>
                                )}

                                {generatedCampaign.brandMentions && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Brand Mentions</Typography>
                                        <Typography variant="body2" paragraph>
                                            {generatedCampaign.brandMentions}
                                        </Typography>
                                    </Grid>
                                )}

                                {generatedCampaign.objectives && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Objectives</Typography>
                                        <Typography variant="body2" paragraph>
                                            {generatedCampaign.objectives}
                                        </Typography>
                                    </Grid>
                                )}

                                {generatedCampaign.metrics && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Metrics</Typography>
                                        <Typography variant="body2" paragraph>
                                            {generatedCampaign.metrics}
                                        </Typography>
                                    </Grid>
                                )}

                                {generatedCampaign.aiSummary && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Executive Summary</Typography>
                                        <Typography variant="body2" paragraph>
                                            {generatedCampaign.aiSummary}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>

                            <Typography variant="h6" gutterBottom>
                                Selected Athletes ({selectedAthletes.length})
                            </Typography>

                            <Grid container spacing={2}>
                                {selectedAthletes.map((athlete) => (
                                    <Grid item xs={12} sm={6} md={4} key={athlete.id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1">{athlete.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {athlete.sport} • {athlete.major}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                            <Button onClick={prevStep} variant="outlined">
                                Back
                            </Button>
                            <Button
                                onClick={submitFinalCampaign}
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    bgcolor: '#4767F5',
                                    '&:hover': { bgcolor: '#3852c4' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create Campaign'}
                            </Button>
                        </Box>
                    </Paper>
                ) : (
                    <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Paper>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Create a New Marketing Campaign
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <Box
                            key={stepNumber}
                            sx={{
                                flex: 1,
                                height: 8,
                                bgcolor: stepNumber <= step ? '#4767F5' : '#e0e0e0',
                                borderRadius: 1,
                                mx: 0.5
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color={step >= 1 ? 'primary' : 'text.secondary'}>
                        Campaign Details
                    </Typography>
                    <Typography variant="body2" color={step >= 2 ? 'primary' : 'text.secondary'}>
                        Review & Edit
                    </Typography>
                    <Typography variant="body2" color={step >= 3 ? 'primary' : 'text.secondary'}>
                        Select Athletes
                    </Typography>
                    <Typography variant="body2" color={step >= 4 ? 'primary' : 'text.secondary'}>
                        Final Review
                    </Typography>
                </Box>
            </Box>

            {renderStep()}

            {/* Add the loading overlay component */}
            <LoadingOverlay
                isVisible={loadingOverlayVisible}
                onComplete={handleLoadingComplete}
                apiCallComplete={apiCallComplete}
            />

            {/* Add the matching overlay */}
            <MatchingOverlay
                isVisible={matchingOverlayVisible}
                onComplete={handleMatchingComplete}
                apiCallComplete={matchingApiComplete}
            />

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}
