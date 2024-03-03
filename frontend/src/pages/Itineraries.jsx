import React, { useState,useContext } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

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

function Itineraries() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [destination, setDestination] = useState("");
  const [peopleGroup, setPeopleGroup] = useState("");
  const [budget, setBudget] = useState("");

  const peopleOptions = ["Solo", "Family", "Couple", "Group"];
  const budgetOptions = ["Economy", "Standard", "Luxury"];
  const { user } = useContext(AuthContext);
  console.log(user)
  console.log("asfdg")
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      userId: user.id,
      destination,
      dateRange,
      peopleGroup,
      budget,
    };
    console.log(formData);

    fetch(`${BASE_URL}/new-itinerary`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response from server:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
            style={{ width: "170px" }}
          >
            Create my trip
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Itineraries;
