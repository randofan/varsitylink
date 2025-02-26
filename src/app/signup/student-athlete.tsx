'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';

// Define types for our form
type StudentAthlete = {
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
  twitter?: string;
  industries: string[];
  marketingOptions: string[];
};

export default function StudentAthleteSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<StudentAthlete>({
    defaultValues: {
      industries: [],
      marketingOptions: [],
    },
  });

  const watchMarketingOptions = watch('marketingOptions');

  // Define marketing options
  const regularMarketingOptions = [
    'Social Media Posts',
    'Product Reviews',
    'Promotional Videos',
    'In-Person Events',
    'Brand Ambassador',
    'Email Marketing'
  ];

  // Effect to handle "Select All" logic
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setValue('marketingOptions', [...regularMarketingOptions]);
    } else {
      setValue('marketingOptions', []);
    }
    setSelectAll(checked);
  };

  // Update selectAll state when individual options change
  const updateSelectAllState = () => {
    if (watchMarketingOptions?.length === regularMarketingOptions.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const onSubmit = async (data: StudentAthlete) => {
    // TODO just make demo work. We'd actually want to make this hit the route in the future.
    console.log("Form data submitted:", data);
    setSubmitted(true);
    reset();
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
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom color="primary">Student Athlete Sign Up</Typography>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography variant="h5" gutterBottom>Personal Information</Typography>
        
        <TextField
          label="Name"
          variant="outlined"
          placeholder="John Doe"
          {...register('name', { required: true })}
          required
          fullWidth
        />
        
        <TextField
          label="Email"
          variant="outlined"
          placeholder="john@example.com"
          {...register('email', { required: true })}
          type="email"
          required
          fullWidth
        />
        
        <FormControl fullWidth required>
          <InputLabel id="sport-label">Sport</InputLabel>
          <Select
            labelId="sport-label"
            label="Sport"
            defaultValue=""
            {...register('sport', { required: true })}
          >
            {sportOptions.map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Age"
          variant="outlined"
          placeholder="e.g., 20"
          {...register('age', { 
            valueAsNumber: true, 
            required: true,
            min: { value: 16, message: "Age must be at least 16" },
            max: { value: 30, message: "Age must be under 30" }
          })}
          type="number"
          required
          fullWidth
        />
        
        <TextField
          label="Major"
          variant="outlined"
          placeholder="e.g., Business"
          {...register('major', { required: true })}
          required
          fullWidth
        />
        
        <FormControl fullWidth required>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            label="Gender"
            defaultValue=""
            {...register('gender', { required: true })}
          >
            {genderOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth required>
          <InputLabel id="ethnicity-label">Ethnicity</InputLabel>
          <Select
            labelId="ethnicity-label"
            label="Ethnicity"
            defaultValue=""
            {...register('ethnicity', { required: true })}
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
          label="Instagram"
          variant="outlined"
          placeholder="e.g., @john_insta"
          {...register('instagram')}
          fullWidth
        />
        
        <TextField
          label="TikTok"
          variant="outlined"
          placeholder="e.g., @john_tiktok"
          {...register('tiktok')}
          fullWidth
        />
        
        <TextField
          label="Pinterest"
          variant="outlined"
          placeholder="e.g., @john_pinterest"
          {...register('pinterest')}
          fullWidth
        />
        
        <TextField
          label="LinkedIn"
          variant="outlined"
          placeholder="LinkedIn profile URL"
          {...register('linkedIn')}
          fullWidth
        />
        
        <TextField
          label="X Username"
          variant="outlined"
          placeholder="e.g., @john_x"
          {...register('twitter')}
          fullWidth
        />

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Preferences
        </Typography>
        
        <Typography variant="subtitle1">Select Industries You&apos;d Work With:</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
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
        </div>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>Marketing Options You&apos;d Be Willing to Do:</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                onChange={(e) => handleSelectAllChange(e.target.checked)}
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
                  {...register('marketingOptions', {
                    onChange: updateSelectAllState
                  })}
                />
              }
              label={option}
            />
          ))}
        </div>

        <Button
          variant="contained"
          type="submit"
          sx={{
            mt: 4,
            bgcolor: '#4767F5',
            '&:hover': {
              bgcolor: '#3852c4'
            },
            padding: '0.75rem',
            fontSize: '1rem'
          }}
        >
          Submit
        </Button>
      </form>
    </main>
  );
}
