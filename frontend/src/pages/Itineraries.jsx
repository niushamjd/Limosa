import React, { useState, useContext, useRef, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenAI from "openai";
import { useLoadScript } from "@react-google-maps/api";

function Itineraries() {
  // State and context setup
  const [dateRange, setDateRange] = useState([null, null]);
  const [destination, setDestination] = useState("");
  const [peopleGroup, setPeopleGroup] = useState("");
  const [budget, setBudget] = useState("");
  const { user } = useContext(AuthContext);
  const [itinerary, setItinerary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formError, setFormError] = useState(""); // State for managing form validation error
  // Options for select inputs
  const peopleOptions = ["Solo", "Family", "Couple", "Group"];
  const budgetOptions = ["Economy", "Standard", "Luxury"];
  const navigate = useNavigate(); // Add this if not already imported
  const cityOptions = ["İstanbul", "İzmir", "Ankara", "Antalya"];
  // Instantiate OpenAI with the API key

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });
  // Function to parse the itinerary response from ChatGPT
  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8", // Replace with your actual Google Maps API key
    libraries,
  });

  const mapRef = useRef(null); // You'll use this ref to instantiate a map object without rendering it

  // Make sure the Google Maps script has loaded before trying to use the PlacesService
  useEffect(() => {
    if (isLoaded && !mapRef.current) {
      // This creates a new map instance without attaching it to any DOM element
      mapRef.current = new window.google.maps.Map(
        document.createElement("div")
      );
    }
  }, [isLoaded]);
  useEffect(() => {
    let timer;
    if (formError) {
      timer = setTimeout(() => {
        setFormError("");
      }, 3000); // Clears the error message after 3 seconds
    }

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [formError]);

  const fetchPlacesInfoAndNearbyRestaurant = async (placeNames) => {
    if (!mapRef.current) {
      console.log("Google Maps JavaScript API has not been loaded yet.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    placeNames.forEach((placeName) => {
      // Step 1: Fetch place details to get the location
      const requestForPlace = {
        query: placeName,
        fields: ["name", "geometry"],
      };

      service.textSearch(requestForPlace, (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results[0]
        ) {
          console.log(`Details for ${placeName}:`, results[0]);

          const location = results[0].geometry.location;

          // Step 2: Find a nearby restaurant using the location of the place
          const requestForRestaurant = {
            location: location,
            radius: "500", // Search within a 500m radius
            type: ["restaurant"],
          };

          service.nearbySearch(requestForRestaurant, (results, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results[0]
            ) {
              console.log(`Nearby restaurant for ${placeName}:`, results[0]);
            } else {
              console.error(
                `Error finding nearby restaurant for ${placeName}:`,
                status
              );
            }
          });
        } else {
          console.error(`Error fetching details for ${placeName}:`, status);
        }
      });
    });
  };

  const extractPlacesFromItinerary = (itineraryResponse) => {
    const places = [];

    // Split the response by lines
    const lines = itineraryResponse.split("\n");

    // Iterate over each line to find "Place:"
    lines.forEach((line) => {
      if (line.startsWith("Place:")) {
        // Extract the place name, trimming "Place: " from the start
        const placeName = line.substring("Place:".length).trim();
        places.push(placeName);
      }
    });

    return places;
  };

  const parseItineraryResponse = (itineraryResponse) => {
    const days = itineraryResponse.split("Day ");
    const itineraryObj = {};
    days.forEach((day) => {
      if (day.trim()) {
        const dateMatch = day.match(/(\d+.*?2024)/); // Regex to find dates, adjust as necessary
        if (dateMatch) {
          const date = dateMatch[0];
          itineraryObj[date] = day.substring(date.length); // Rest of the day's plan
        }
      }
    });
    console.log(itineraryObj);
    return itineraryObj;
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate("/login"); // Redirects to login page if user is not logged in
      return; // Prevents further execution of the function
    }
    if (
      !destination ||
      !dateRange[0] ||
      !dateRange[1] ||
      !peopleGroup ||
      !budget
    ) {
      setFormError("All fields are required. Please fill out the entire form.");
      return;
    }
    setFormError(""); // Clear any existing error messages
    setIsLoading(true);
    const prompt = `Generate a travel itinerary for ${destination} for a ${peopleGroup.toLowerCase()} with a ${budget.toLowerCase()} budget considering user interests in ${user.interests} from ${
      dateRange[0]
    } to ${
      dateRange[1]
    }. For each day, present the itinerary in a structured format with explicit headings for each day (e.g., "Day 1: Tuesday, 19 Mar 2024"), followed by the names of places to visit, each accompanied by a brief activity description. List each place and activity on separate lines, starting with "Place:" for the place name and "Activity:" for the description. Conclude the itinerary with general travel tips for the city, prefaced by "**Tips:**".

    Example format:
    Day 1: Tuesday, 19 Mar 2024
    Place: Hagia Sophia
    Activity: Explore the iconic Hagia Sophia museum, admiring its stunning architecture and historical significance.
    Place: Topkapi Palace
    Activity: Visit the Topkapi Palace to learn about the rich history of the Ottoman Empire and enjoy the beautiful gardens.
    **Tips:**
    - Use public transportation such as trams and buses for cost-effective travel.
    - Stay in centrally located accommodations to explore major sites on foot.`;

    try {
      // Call to OpenAI's API
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      setIsLoading(false);

      // Parse the response and set the itinerary state
      setItinerary(
        parseItineraryResponse(completion.choices[0].message.content)
      );
      const places = extractPlacesFromItinerary(
        completion.choices[0].message.content
      );
      console.log("Extracted Places:", places); // Lo
      fetchPlacesInfoAndNearbyRestaurant(places);
      console.log(completion.choices[0].message.content);
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating trip plan:", error);
    }
  };

  // Render the component
  return (
    <div className="trip-form-container">
      <h2>Get your personalized itinerary</h2>
      {formError && (
        <div className="message-container">
          <div className="message-content">{formError}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-content">
        {/* Dropdown for selecting destination */}
        <Box mt={2}>
          <FormControl fullWidth margin="normal" error={!!formError && !destination}>
            <InputLabel id="destination-select-label">Where do you want to go?</InputLabel>
            <Select
              labelId="destination-select-label"
              id="destination-select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              label="Where do you want to go?"
            >
              {cityOptions.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField
                    {...startProps}
                    error={!!formError && !dateRange[0]}
                  />
                  <Box sx={{ mx: 2 }}>to</Box>
                  <TextField
                    {...endProps}
                    error={!!formError && !dateRange[1]}
                  />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box mt={2}>
          <FormControl
            fullWidth
            margin="normal"
            error={!!formError && !peopleGroup}
          >
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
          <FormControl fullWidth margin="normal" error={!!formError && !budget}>
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
          {Object.keys(itinerary).map((date) => (
            <Accordion key={date}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{date}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <pre>{itinerary[date]}</pre>
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
