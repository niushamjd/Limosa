/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { BASE_URL } from "../utils/config";
import {
  generateItineraryPrompt,
  fetchItinerary,
} from "../services/ItineraryService";
import {
  fetchNearbyRestaurants,
  fetchPlaceDetails,
  fetchPlaceCoordinates,
} from "../services/RestaurantService";
import {
  parseItineraryResponse,
  addRestaurantsToItinerary,
} from "../services/ItineraryParserService";
import loadingIcon from "../assets/images/loading.mp4";
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
  const minDate = dayjs(); // Today's date as the minimum date
  const maxDate = dayjs().add(1, "year"); // One year from today as the maximum date
  const [isFormValid, setIsFormValid] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [destination, setDestination] = useState("");
  const [peopleGroup, setPeopleGroup] = useState("");
  const [groupName, setgroupName] = useState(""); // Ensure this line exists
  const [budget, setBudget] = useState("");
  const [itineraryId, setItineraryId] = useState("");

  const { user } = useContext(AuthContext);
  const [itinerary, setItinerary] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(""); // State for managing form validation error
  // Options for select inputs
  const peopleOptions = ["Solo", "Family", "Couple", "Group"];
  const budgetOptions = ["Economy", "Standard", "Luxury"];
  const groupOptions = user?.groups.map((group) => group.groupName) || [
    "You have no groups",
  ];

  const navigate = useNavigate(); // Add this if not already imported
  const location = useLocation();
  const cityOptions = ["İstanbul", "Ankara"];
  // Instantiate OpenAI with the API key
  const navigateToItinerary = () => {
    navigate("/itinerary");
  };

  const validateForm = () => {
    if (
      destination && 
      dateRange[0] && 
      dateRange[1] && 
      peopleGroup && 
      budget &&
      (peopleGroup !== "Group" || groupName) &&	
              dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day') <= 3
    ) {
      setIsFormValid(true);	
      setFormError("");	
    } else {	

      setIsFormValid(false);
      setFormError("Please ensure all fields are correctly filled and the date range does not exceed 3 days.");	
    }
  };
    
  
  const openai = new OpenAI({
    apiKey: "YOUR_API_KEY",
    dangerouslyAllowBrowser: true,
  });
  // Function to parse the itinerary response from ChatGPT
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY", // Replace with your actual Google Maps API key
    libraries,
  });
  useEffect(() => {
    // Check if there's a state passed with navigation and has destination property
    window.scrollTo(0, 0);
    if (location.state && location.state.destination) {
      setDestination(location.state.destination);
    }
  }, [location]);

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

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"; // Prevent scroll when loading
    } else {
      document.body.style.overflow = ""; // Allow scroll when not loading
    }
  }, [isLoading]);
  useEffect(() => {
    if (Object.keys(itinerary).length > 0) {
      fetchNearbyRestaurants(mapRef, itinerary);
    }
  }, [itinerary]); // Dependency array ensures this effect runs only when `itinerary` changes

  

  
  const getCityImage = (cityName) => {
    const randomNum = Math.floor(Math.random() * 4) + 1;
    const formattedCityName = `${cityName.replace(/ /g, "-")}-${randomNum}`;
    // Direct path from the public directory
    return `${formattedCityName}.jpg`;
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    validateForm(); // Validate the form before submission

    if (formError) {
      console.error("Form submission halted due to errors.");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (
      !destination ||
      !dateRange[0] ||
      !dateRange[1] ||
      !peopleGroup ||
      !budget
    ) {
      setFormError("All fields are required. Please fill out the entire form.");
      setIsFormValid(false);
      return;
    }

    setIsLoading(true);

    prompt = generateItineraryPrompt(
      destination,
      peopleGroup,
      budget,
      user,
      dateRange,
      groupName
    );

    try {
      const generatedItinerary = await fetchItinerary(prompt);

      // console.log("Extracted Itinerary Response:", completion.choices[0].message.content);

      // After fetching or parsing your initial itinerary:
   const parsedItinerary = await parseItineraryResponse(generatedItinerary);
for (const date of Object.keys(parsedItinerary)) {
  for (const period of Object.keys(parsedItinerary[date])) {
    for (const event of parsedItinerary[date][period]) {
      if (event.type === "Place") {
        try {
          const coordinates = await fetchPlaceCoordinates(event.name, destination || "Default City");
          // Add coordinates to the event
          console.log(`Coordinates for ${event.name}:`, coordinates);
          const placeDetails = await fetchPlaceDetails(event.name, destination|| "Default City");
          event.coordinates = coordinates;

        } catch (error) {
          console.error(`Failed to fetch details for ${event.name}:`, error);
        }
      }
    }
  }
}

      const restaurants = await fetchNearbyRestaurants(
        mapRef,
        parsedItinerary,
        budget
      );

      const itineraryWithRestaurants = await addRestaurantsToItinerary(
        parsedItinerary,
        restaurants
      );
      try {
        const itineraryPost = {
          userId: user._id,
          city: destination,
          group: peopleGroup === "Group" ? groupName : peopleGroup,
          budget: budget,
          itineraryEvents: itineraryWithRestaurants,
          dateRange: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString(),
          },
          tips: "Additional tips or comments here",
          photo: getCityImage(destination),
          createdBy: user._id,
        };
        console.log("Itinerary post data:", itineraryPost);

        const response = await fetch(`${BASE_URL}/itinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itineraryPost),
        });

        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        const data = await response.json();
        console.log("Itinerary created successfully:", data);

        // Store itinerary ID after successful creation
        setItineraryId(data.data._id);

        navigate("/itinerary", { state: { itinerary: data.data } }); // Ensure that the data passed contains the ID
      } catch (error) {
        console.error("Error:", error);
        setFormError("An error occurred while creating the itinerary.");
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("An error occurred while generating the itinerary.");
      setIsLoading(false);
    }
  };

  const handleDateChange = (newValue) => {
    const [newStart, newEnd] = newValue;
    const start = newStart ? dayjs(newStart) : null;
    const end = newEnd ? dayjs(newEnd) : null;

    if (start && end && end.diff(start, 'day') > 3) {
        // If the date range exceeds 3 days
        setDateRange([null, null]); // Clear the date range
        setFormError("The selected date range should not exceed 3 days.");
        setIsFormValid(false); // Disable form submission
    } else {
        // Valid date range
        setDateRange([start, end]);
        setFormError(""); // Clear any existing errors
        setIsFormValid(true); // Enable form submission
    }
};

  // Render the component
  return (
    <div>
      <div className={`content-container ${isLoading ? "blurred" : ""}`}>
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
              <FormControl
                fullWidth
                margin="normal"
                error={!!formError && !destination}
              >
                <InputLabel id="destination-select-label">
                  Where do you want to go?
                </InputLabel>
                <Select
                  labelId="destination-select-label"
                  id="destination-select"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                  }}
                  label="Where do you want to go?"
                >
                  {cityOptions.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
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
                  onChange={(newValue) => {
                    setDateRange(newValue);
                    const today = dayjs().startOf("day"); // Bugünün tarihini başlangıç saatine ayarla
                    const start = dayjs(newValue[0]);
                    const end = dayjs(newValue[1]);

                    // Başlangıç tarihinin bugünden önce olup olmadığını kontrol et
                    if (start.isBefore(today)) {
                      setDateRange([null, null]); // Geçmiş bir tarih seçilirse tarih aralığını sıfırla
                      setFormError(
                        "You cannot select a past date for the start date. Please use the calendar to select a valid date range."
                      );
                      setIsFormValid(false);
                    } else {
                      setDateRange([start, end]); // Geçerli tarihlerde tarih aralığını güncelle
                      setFormError(""); // Form hatalarını temizle

                      // Seçilen tarih aralığının 3 günü aşmamasını kontrol et
                      if (end && start && end.diff(start, "day") > 3) {
                        setFormError(
                          "The selected date range should not exceed 3 days. Please use calendar to select a valid date range."
                        );
                        setIsFormValid(false);
                      } else {
                        setFormError("");
                        setIsFormValid(true);
                      }
                    }
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField
                        {...startProps}
                        inputProps={{ readOnly: true }}
                        error={!!formError && !dateRange[0]}
                      />
                      <Box sx={{ mx: 2 }}>to</Box>
                      <TextField
                        {...endProps}
                        inputProps={{ readOnly: true }}
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
            {peopleGroup === "Group" && (
              <Box mt={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select your group</InputLabel>
                  <Select
                    value={groupName}
                    onChange={(e) => setgroupName(e.target.value)}
                    input={<OutlinedInput label="Select your group" />}
                  >
                    {groupOptions.map((groupName) => (
                      <MenuItem key={groupName} value={groupName}>
                        {groupName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            <Box mt={2}>
              <FormControl
                fullWidth
                margin="normal"
                error={!!formError && !budget}
              >
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
                disabled={!isFormValid} // Use the isFormValid state to enable/disable the button
              >
                Create my trip
              </Button>
            </div>
          </form>
          <br />

          <br />
          {/* Itinerary accordion display */}
          {Object.keys(itinerary).length > 0 && (
            <div className="itinerary-accordion">
              {Object.entries(itinerary).map(([date, periods]) => (
                <Accordion key={date}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{`Day ${date}`}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.entries(periods).map(([period, activities]) => (
                      <div key={period}>
                        <Typography variant="h6" component="h2">{`${
                          period.charAt(0).toUpperCase() + period.slice(1)
                        }`}</Typography>
                        <ul>
                          {activities.map((activity, index) => (
                            <li key={index}>
                              <strong>
                                {activity.type === "Place" ? "Visit" : "Eat at"}
                                :
                              </strong>{" "}
                              {activity.name} - <em>{activity.activity}</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <p>Customizing your trip plan...</p>
            <video src={loadingIcon} autoPlay loop muted />
          </div>
        </div>
      )}
    </div>
  );
}

export default Itineraries;

