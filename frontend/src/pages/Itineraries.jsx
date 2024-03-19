import React, { useState, useContext } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AuthContext } from "../context/AuthContext";
import "../styles/itineraries.css";
import {
  Box,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenAI from "openai";

function Itineraries() {
  // State and context setup
  const [dateRange, setDateRange] = useState([null, null]);
  const [destination, setDestination] = useState("");
  const [peopleGroup, setPeopleGroup] = useState("");
  const [budget, setBudget] = useState("");
  const { user } = useContext(AuthContext);
  const [itinerary, setItinerary] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Options for select inputs
  const peopleOptions = ["Solo", "Family", "Couple", "Group"];
  const budgetOptions = ["Economy", "Standard", "Luxury"];

  // Instantiate OpenAI with the API key
  
  const openai = new OpenAI({ apiKey: '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', dangerouslyAllowBrowser: true  });
  // Function to parse the itinerary response from ChatGPT
  const parseItineraryResponse = (itineraryResponse) => {
    const days = itineraryResponse.split('Day ');
    const itineraryObj = {};
    days.forEach(day => {
      if (day.trim()) {
        const dateMatch = day.match(/(\d+.*?2024)/); // Regex to find dates, adjust as necessary
        if (dateMatch) {
          const date = dateMatch[0];
          itineraryObj[date] = day.substring(date.length); // Rest of the day's plan
        }
      }
    });
    return itineraryObj;
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); 
    const prompt = `Plan a trip to ${destination} for ${peopleGroup.toLowerCase()} with a ${budget.toLowerCase()} budget from ${dateRange[0]} to ${dateRange[1]}.indicate each date`;

    try {
      // Call to OpenAI's API
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
      })
      setIsLoading(false); ;

      // Parse the response and set the itinerary state
      setItinerary(parseItineraryResponse(completion.choices[0].message.content));
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating trip plan:", error);
    }
  };

  // Render the component
  return (
    <div className="trip-form-container">
      <h2>Get your personalized itinerary</h2>
      <form onSubmit={handleSubmit} className="form-content">
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
        <div className="centered-button-container">
        <Button
          type="submit"
          variant="contained"
          className="btn primary__btn"
          sx={{ mt: 2 }}
        >
          Create my trip
        </Button>
        </div>
      </form>
      <br />
      {isLoading && (
        <div className="loading-indicator">
          <p>Loading your trip plan...</p>
          {/* Replace with an image or emoji if you prefer */}
        </div>
      )}
<br />
      {/* Itinerary accordion display */}
      {Object.keys(itinerary).length > 0 && (
        <div className="itinerary-accordion">
          {Object.keys(itinerary).map(date => (
            <Accordion key={date}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{date}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {itinerary[date]}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
}

export default Itineraries;
