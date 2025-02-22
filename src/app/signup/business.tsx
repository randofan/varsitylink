'use client';

import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';

interface BusinessFormValues {
  name: string;
  email: string;
  missionStatement: string;
  socialLinks: string;
  website: string;
  campaignSummary: string;
  budget: string;
  athletePartnerCount: string;
  sports: string[];
  customSport?: string;
}

export default function BusinessSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [showCustomSport, setShowCustomSport] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<BusinessFormValues>({
    defaultValues: { sports: [] },
  });

  const regularSports = useMemo(() => ['Football', 'Basketball', 'Soccer', 'Baseball'], []);
  const watchSports = watch('sports');

  useEffect(() => {
    if (watchSports?.includes('Select All')) {
      setValue('sports', [...regularSports]);
    } else if (selectAll && watchSports?.length !== regularSports.length) {
      setSelectAll(false);
    }
  }, [watchSports, setValue, regularSports, selectAll]);

  useEffect(() => {
    setShowCustomSport(watchSports?.includes('Other') || false);
  }, [watchSports]);

  const onSubmit = async (data: BusinessFormValues) => {
    // Process sports selections
    let finalSports = data.sports
      .filter(sport => sport !== 'Select All' && sport !== 'Other');

    // Process custom sports if "Other" is selected
    if (data.customSport && data.sports.includes('Other')) {
      const customSports = data.customSport
        .split(',')
        .map(sport => sport.trim())
        .filter(sport => sport.length > 0);

      finalSports = [...finalSports, ...customSports];
    }

    const finalData = {
      ...data,
      sports: finalSports
    };

    const response = await fetch('/api/signup/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData),
    });

    if (response.ok) {
      setSubmitted(true);
      reset();
    } else {
      alert('Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0 py-16">
        <Typography variant="h4" color="primary" gutterBottom>
          Thank You For Signing Up!
        </Typography>
        <Typography variant="body1" component="p">
          Your business information has been successfully submitted. Our team will review your application and contact you soon.
        </Typography>
      </div>
    );
  }

  const partnerCountOptions = ['1', '2', '3', '4', '5', '6', 'any'];

  return (
    <main className="w-full max-w-3xl mx-auto px-4 md:px-8 py-8">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          placeholder="Acme Corp"
          {...register('name', { required: true })}
          required
        />
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          placeholder="example@domain.com"
          {...register('email', { required: true })}
          type="email"
          required
        />
        <TextField
          id="outlined-basic"
          label="Mission Statement"
          variant="outlined"
          placeholder="Our mission is to..."
          {...register('missionStatement', { required: true })}
          multiline
          minRows={3}
          required
        />
        <TextField
          id="outlined-basic"
          label="Social Links"
          variant="outlined"
          placeholder="Facebook, Twitter, Instagram URLs"
          {...register('socialLinks', { required: true })}
          required
        />
        <TextField
          id="outlined-basic"
          label="Website"
          variant="outlined"
          placeholder="https://www.example.com"
          {...register('website', { required: true })}
          type="url"
          required
        />

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Your First NIL Marketing Campaign
        </Typography>

        <TextField
          id="outlined-basic"
          label="Campaign Summary"
          variant="outlined"
          placeholder="e.g., Create a marketing campaign for a new athleisure line"
          {...register('campaignSummary', { required: true })}
          multiline
          minRows={2}
          required
        />
        <TextField
          id="outlined-basic"
          label="Budget"
          variant="outlined"
          placeholder="e.g., $5000 or free goods/services"
          {...register('budget', { required: true })}
          required
        />
        <FormControl fullWidth>
          <Select
            id="outlined-basic"
            label="Athlete Partner Count"
            variant="outlined"
            defaultValue=""
            {...register('athletePartnerCount', { required: true })}
            required
          >
            {partnerCountOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === 'any' ? 'Any number of athletes' : `${option} athlete${option === '1' ? '' : 's'}`}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select the number of athletes you want to partner with</FormHelperText>
        </FormControl>

        <Typography>Select Sports You Want to Partner With:</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('sports', [...regularSports]);
                } else {
                  setValue('sports', []);
                }
                setSelectAll(e.target.checked);
              }}
            />
          }
          label="Select All"
        />

        {regularSports.map((sport) => (
          <FormControlLabel
            key={sport}
            control={
              <Checkbox
                checked={watchSports?.includes(sport)}
                value={sport}
                {...register('sports')}
              />
            }
            label={sport}
          />
        ))}

        <FormControlLabel
          control={
            <Checkbox
              value="Other"
              {...register('sports')}
            />
          }
          label="Other"
        />

        {showCustomSport && (
          <TextField
            id="outlined-basic"
            label="Custom Sport"
            variant="outlined"
            placeholder="e.g. Volleyball, Tennis, Swimming"
            {...register('customSport', { required: watchSports?.includes('Other') })}
            helperText="For multiple sports, separate them with commas"
            fullWidth
            sx={{ mt: 2 }}
          />
        )}

        <Button
          variant="contained"
          type="submit"
          sx={{
            mt: 2,
            bgcolor: '#4767F5',
            '&:hover': {
              bgcolor: '#3852c4'
            }
          }}
        >
          Submit
        </Button>
      </form>
    </main>
  );
}
