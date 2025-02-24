'use client';

import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BusinessSignup from './business';
import StudentAthleteSignup from './student-athlete';

export default function SignupPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          variant="fullWidth"
        >
          <Tab label="I'm a Business Owner" />
          <Tab label="I'm a Student Athlete" />
        </Tabs>
      </Box>

      {currentTab === 0 && <BusinessSignup />}
      {currentTab === 1 && <StudentAthleteSignup />}
    </div>
  );
}
