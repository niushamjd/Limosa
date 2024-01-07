import React, { useState } from "react";
import "../style/TripForm.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import {
  Box,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";

function TripForm() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [destination, setDestination] = useState("");
  const [peopleGroup, setPeopleGroup] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);

  const peopleOptions = ["Solo", "Family", "Couple", "Group"];
  const budgetOptions = ["Economy", "Standard", "Luxury"];
  const interestsOptions = [
    "Cultural",
    "Foodie",
    "Adventure",
    "Relaxation-lover",
    "History",
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create an object with the form data
    const formData = {
      destination,
      dateRange,
      peopleGroup,
      budget,
      selectedInterests,
    };
    console.log(formData);
    // Send a POST request to your server with the form data using Axios
    axios
      .post("http://localhost:3001/itinerary", formData)
      .then((response) => {
        console.log("Response from server:", response.data);
        // Handle the server response here
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors here
      });
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
        <Box mt={2}>
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
        </Box>
        <Box mt={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>How many people are going?</InputLabel>
            <Select
              value={peopleGroup}
              onChange={(e) => setPeopleGroup(e.target.value)}
              input={<OutlinedInput label="How many people are going?" />}
            >
              {peopleOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>What is your ideal budget?</InputLabel>
            <Select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              input={<OutlinedInput label="What is your ideal budget?" />}
            >
              {budgetOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt={2} mb={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Choose your interests</InputLabel>
            <Select
              multiple
              value={selectedInterests}
              onChange={(e) => setSelectedInterests(e.target.value)}
              input={<OutlinedInput label="Choose your interests" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {interestsOptions.map((interest) => (
                <MenuItem key={interest} value={interest}>
                  {interest}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
            style={{ width: "170px" }} // Adjust the width as needed
          >
            Create my trip
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TripForm;
