import React, { useState, useEffect } from 'react';
import '../style/TripForm.css';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Box, TextField, Button, InputLabel, Select, MenuItem, FormControl, OutlinedInput } from '@mui/material';

function TripForm() {
    const [dateRange, setDateRange] = useState([null, null]);
    const [destination, setDestination] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [budget, setBudget] = useState('');
    const [selectedInterests, setSelectedInterests] = useState([]);

    const interestsOptions = ['Cultural', 'Foodie', 'Adventure', 'Relaxation-lover', 'History'];

    const handleInterestChange = (event) => {
        setSelectedInterests(event.target.value);
    };

    useEffect(() => {
      // Log date range when it changes
      if (dateRange[0] && dateRange[1]) {
        console.log('Date Range:', dateRange.map(date => date ? date.format('YYYY-MM-DD') : 'null'));
      }
    }, [dateRange]);

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Form Data:', { destination, dateRange, numberOfPeople, budget, selectedInterests });
      // Further form submission logic goes here
    };

   

    return (
      <div className="trip-form-container">
        <h2>Get your personalized itinerary</h2>
        <form onSubmit={handleSubmit}>
        <TextField
            label="Where do you want to go?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}>to</Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>



          <TextField
            label="How many people are going?"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="What is your ideal budget?"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            margin="normal"
          />

<FormControl fullWidth margin="normal">
            <InputLabel>Choose your interests</InputLabel>
            <Select
              multiple
              value={selectedInterests}
              onChange={handleInterestChange}
              input={<OutlinedInput label="Choose your interests" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {interestsOptions.map((interest) => (
                <MenuItem key={interest} value={interest}>
                  {interest}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" className="submit-button">Create my trip</Button>
        </form>
      </div>
    );
}

export default TripForm;
