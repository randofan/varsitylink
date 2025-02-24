'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';

interface StudentAthleteFormValues {
  name: string;
  email: string;
  sport: string;
  age: number;
  major: string;
  gender: string;
  ethnicity: string;
  instagram?: string;
  tiktok?: string;
  pinterest?: string;
  linkedIn?: string;
  xUsername?: string;
  industries: string[];
  marketingOptions: string[];
}

export default function StudentAthleteSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<StudentAthleteFormValues>({
    defaultValues: {
      industries: [],
      marketingOptions: [],
    },
  });

  const watchMarketingOptions = watch('marketingOptions');
  const regularMarketingOptions = useMemo(() => ['Social Media Posts', 'In Person Appearances'], []);


  useEffect(() => {
    if (watchMarketingOptions?.includes('Select All')) {
      setValue('marketingOptions', [...regularMarketingOptions]);
    } else if (selectAll && watchMarketingOptions?.length !== regularMarketingOptions.length) {
      setSelectAll(false);
    }
  }, [watchMarketingOptions, setValue, regularMarketingOptions, selectAll]);

  const onSubmit = async (data: StudentAthleteFormValues) => {
    const response = await fetch('/api/signup/student-athlete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
      <>
        <Typography variant="h4" color="primary" gutterBottom>
          Thank You For Signing Up!
        </Typography>
        <Typography variant="body1" component="p">
          Your information has been successfully submitted. Our team will review your application and contact you soon.
        </Typography>
      </>
    );
  }

  const industriesList = [
    'No Preference/Any',
    'Restaurants',
    'Supplement Companies',
    'Sports Equipment',
    'Fashion',
    'Beauty',
  ];

  const sportOptions = [
    'Football',
    'Basketball',
    'Baseball',
    'Soccer',
    'Volleyball',
    'Track & Field',
    'Swimming',
    'Tennis',
    'Golf',
    'Other'
  ];

  const genderOptions = [
    'Male',
    'Female',
    'Non-binary',
    'Prefer not to say'
  ];

  const ethnicityOptions = [
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Native American',
    'Pacific Islander',
    'White',
    'Two or More Races',
    'Prefer not to say'
  ];

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography variant="h5" gutterBottom>Personal Information</Typography>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          placeholder="John Doe"
          {...register('name', { required: true })}
          required
        />
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          placeholder="john@example.com"
          {...register('email', { required: true })}
          type="email"
          required
        />
        <FormControl fullWidth>
          <Select
            id="outlined-basic"
            label="Sport"
            variant="outlined"
            defaultValue=""
            {...register('sport', { required: true })}
            required
          >
            {sportOptions.map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="outlined-basic"
          label="Age"
          variant="outlined"
          placeholder="e.g., 20"
          {...register('age', { valueAsNumber: true, required: true })}
          type="number"
          required
        />
        <TextField
          id="outlined-basic"
          label="Major"
          variant="outlined"
          placeholder="e.g., Business"
          {...register('major', { required: true })}
          required
        />
        <FormControl fullWidth>
          <Select
            id="outlined-basic"
            label="Gender"
            variant="outlined"
            defaultValue=""
            {...register('gender', { required: true })}
            required
          >
            {genderOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <Select
            id="outlined-basic"
            label="Ethnicity"
            variant="outlined"
            defaultValue=""
            {...register('ethnicity', { required: true })}
            required
          >
            {ethnicityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Social Media Profiles
        </Typography>
        <TextField
          id="outlined-basic"
          label="Instagram"
          variant="outlined"
          placeholder="e.g., @john_insta"
          {...register('instagram')}
        />
        <TextField
          id="outlined-basic"
          label="TikTok"
          variant="outlined"
          placeholder="e.g., @john_tiktok"
          {...register('tiktok')}
        />
        <TextField
          id="outlined-basic"
          label="Pinterest"
          variant="outlined"
          placeholder="e.g., @john_pinterest"
          {...register('pinterest')}
        />
        <TextField
          id="outlined-basic"
          label="LinkedIn"
          variant="outlined"
          placeholder="LinkedIn profile URL"
          {...register('linkedIn')}
        />
        <TextField
          id="outlined-basic"
          label="X Username"
          variant="outlined"
          placeholder="e.g., @john_x"
          {...register('xUsername')}
        />

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Preferences
        </Typography>
        <Typography>Select Industries You&apos;d Work With:</Typography>
        {industriesList.map((industry) => (
          <FormControlLabel
            key={industry}
            control={
              <Checkbox
                value={industry}
                {...register('industries')}
              />
            }
            label={industry}
          />
        ))}

        <Typography sx={{ mt: 2 }}>Marketing Options You&apos;d Be Willing to Do:</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('marketingOptions', [...regularMarketingOptions]);
                } else {
                  setValue('marketingOptions', []);
                }
                setSelectAll(e.target.checked);
              }}
            />
          }
          label="Select All"
        />

        {regularMarketingOptions.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={watchMarketingOptions?.includes(option)}
                value={option}
                {...register('marketingOptions')}
              />
            }
            label={option}
          />
        ))}

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
