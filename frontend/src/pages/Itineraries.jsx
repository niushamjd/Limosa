/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import React, { useState, useContext, useRef, useEffect ,useMemo} from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { BASE_URL } from "../utils/config";

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
import { useLoadScript, GoogleMap } from "@react-google-maps/api";

function Itineraries() {
  // State and context setup
  const minDate = dayjs(); // Today's date as the minimum date
const maxDate = dayjs().add(1, 'year'); // One year from today as the maximum date

  const [isFormValid, setIsFormValid] = useState(true);
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
    apiKey: "sk-proj-dkq2T69c4Jwp8J1BCnI6T3BlbkFJxp91LmBxZGkG8upGiR2O",
    dangerouslyAllowBrowser: true,
  });
  // Function to parse the itinerary response from ChatGPT
  const libraries = useMemo(() => ["places"], []);
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

  const fetchNearbyRestaurantForLastPlaces = async (itinerary) => {
    if (!mapRef.current) {
        console.error("Google Maps JavaScript API has not been loaded yet.");
        return [];
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    let restaurantsArray = [];  // Array to hold all restaurant details

    outerLoop:  // Label for the outer loop for easy break
    for (const [date, periods] of Object.entries(itinerary)) {
        for (const [period, activities] of Object.entries(periods)) {
            const lastPlace = activities.filter(activity => activity.type === 'Place').pop();

            if (lastPlace) {
                const request = {
                    query: lastPlace.name,
                    fields: ['name', 'geometry.location'],
                };

                try {
                    const placeResults = await new Promise((resolve, reject) => {
                        service.textSearch(request, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                                resolve(results);
                            } else {
                                reject(`Place details not found for ${lastPlace.name}`);
                            }
                        });
                    });

                    const location = placeResults[0].geometry.location;
                    const restaurantRequest = {
                        location: location,
                        radius: '1000',  // Search within 1000 meters
                        type: ['restaurant'],
                    };

                    const restaurantResults = await new Promise((resolve, reject) => {
                        service.nearbySearch(restaurantRequest, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                                resolve(results);
                            } else {
                                reject(`No nearby restaurant found for ${lastPlace.name}`);
                            }
                        });
                    });

                    // Only add the first restaurant result to the array, checking for duplicates
                    for (const restaurant of restaurantResults) {
                        const isDuplicate = restaurantsArray.some(r => r.name === restaurant.name && r.location === restaurant.vicinity);
                        if (!isDuplicate) {
                            restaurantsArray.push({
                                name: restaurant.name,
                                activity: "Dining",
                                type: "Restaurant",
                                location: restaurant.vicinity,
                                photo: restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].getUrl() : ''
                            });
                            break; // Add only one unique restaurant per last place
                        }
                    }

                    // Break out of the loop if 6 unique restaurants have been found
                    if (restaurantsArray.length === 6) {
                        break outerLoop;
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    console.log("Collected Restaurants:", restaurantsArray);
    return restaurantsArray;
};

  
function addRestaurantsToItinerary(itinerary, restaurants) {
  const updatedItinerary = {...itinerary};
  let restaurantIndex = 0;  // To keep track of which restaurant to add next

  // Iterate over each date in the itinerary
  for (const date in updatedItinerary) {
      if (!updatedItinerary.hasOwnProperty(date)) {
          continue;
      }

      // Go through each period: morning, afternoon, evening
      ['morning', 'afternoon', 'evening'].forEach(period => {
          if (updatedItinerary[date][period] && restaurants[restaurantIndex]) {
              // Add a restaurant to the current period
              updatedItinerary[date][period].push({
                  name: restaurants[restaurantIndex].name,
                  activity: 'Dining at ' + restaurants[restaurantIndex].name,
                  type: 'Restaurant',
                  location: restaurants[restaurantIndex].location,
                  photo: restaurants[restaurantIndex].photo
              });

              // Increment to use the next restaurant for the next period
              restaurantIndex = (restaurantIndex + 1) % restaurants.length; // Loop back if end is reached
          }
      });

      // Optional: Stop adding if you've cycled through all restaurants once
      if (restaurantIndex >= restaurants.length) {
          break; // Remove this if you want to cycle restaurants until all periods are filled
      }
  }

  return updatedItinerary;
}




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
    const itineraryObj = {};
    const days = itineraryResponse.split("Day ").slice(1); // Split response by "Day" and ignore the first empty split
  
    days.forEach(day => {
      const lines = day.split("\n").map(line => line.trim()); // Trim lines to remove any extraneous whitespace
      const dateLine = lines.shift(); // The first line contains the date
      const date = dateLine.match(/\d+ \w+ \d{4}/)[0]; // Extract the date with better regex
  
      itineraryObj[date] = { morning: [], afternoon: [], evening: [] };
      let currentPeriod = 'morning';
  
      lines.forEach((line, index) => {
        if (line.includes("Morning:")) currentPeriod = 'morning';
        else if (line.includes("Afternoon:")) currentPeriod = 'afternoon';
        else if (line.includes("Evening:")) currentPeriod = 'evening';
        else if (line.startsWith("- Place:") || line.startsWith("- Restaurant:")) {
          // The next line is assumed to be the activity description
          const activityLine = lines[index + 1]; // Get the next line for the activity
          const name = line.split(":")[1].trim();
          const activity = activityLine ? activityLine.split(":")[1].trim() : "";
  
          itineraryObj[date][currentPeriod].push({
            type: line.startsWith("- Place:") ? "Place" : "Restaurant",
            name: name,
            activity: activity
          });
        }
      });
    });
    return itineraryObj;
  };
  
  
  useEffect(() => {
    if (Object.keys(itinerary).length > 0) {
      fetchNearbyRestaurantForLastPlaces(itinerary);
    }
  }, [itinerary]); // Dependency array ensures this effect runs only when `itinerary` changes
  
  

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (formError) {
      console.error("Form submission halted due to errors.");
      return;
    }
  
    if (!user) {
      navigate("/login");
      return;
    }
  
    if (!destination || !dateRange[0] || !dateRange[1] || !peopleGroup || !budget) {
      setFormError("All fields are required. Please fill out the entire form.");
      return;
    }
  
    setIsLoading(true);
  
    const prompt = `Generate a structured travel itinerary for ${destination} for a ${peopleGroup.toLowerCase()} with a ${budget.toLowerCase()} budget considering user interests in ${user.interests} from ${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1].format('YYYY-MM-DD')}, covering each day including last day . Divide the itinerary into morning, afternoon, and evening sections for each day. For each period, suggest two places to visit. Present the itinerary with explicit headings for each day and period, followed by the names of places to visit, each accompanied by a brief description.

    Example format:
    Day 1: Tuesday, 19 Mar 2024
    Morning:
    - Place: Hagia Sophia
      Activity: Explore the iconic museum's stunning architecture and delve into its history as a church, mosque, and museum.
    - Place: Topkapi Palace
      Activity: Discover the luxurious residence of the Ottoman sultans, its exquisite architecture, and the historical artifacts within.
    
    Afternoon:
    - Place: Blue Mosque
      Activity: Visit the Blue Mosque to marvel at its striking blue tiles and majestic domes.
    - Place: Basilica Cistern
      Activity: Explore the ancient underground waterway with its mystical atmosphere and Medusa head pillars.
    
    Evening:
    - Place: Galata Tower
      Activity: Climb the Galata Tower for breathtaking panoramic views of Istanbul, especially beautiful at sunset.
    - Place: Istiklal Street
      Activity: Stroll down Istiklal Street, enjoying the vibrant nightlife, shopping, and dining options available.
    
    Day 2: Wednesday, 20 Mar 2024
    Morning:
    - Place: Dolmabahce Palace
      Activity: Tour the opulent Dolmabahce Palace, admiring its lavish decor and the beautiful Bosphorus views.
    - Place: Istanbul Modern
      Activity: Visit Istanbul Modern to see contemporary art exhibitions showcasing Turkish and international artists.
    
    Afternoon:
    - Place: Spice Bazaar
      Activity: Experience the scents and colors of the Spice Bazaar, where you can find a variety of spices, teas, and Turkish delights.
    - Place: Suleymaniye Mosque
      Activity: Visit the Suleymaniye Mosque, a masterpiece of Ottoman architecture, to appreciate its beauty and serene atmosphere.
    
    Evening:
    - Place: Bosphorus Cruise
      Activity: Take a Bosphorus cruise to see Istanbul's skyline from the water, including historical sites along the European and Asian shores.
    - Place: Balat Neighborhood
      Activity: Wander through the colorful streets of Balat, known for its picturesque houses, trendy cafes, street art, and a mix of Jewish, Greek, and Armenian heritage.
    
    **Tips:**
    - Use public transportation such as trams and buses for cost-effective travel.
    - Stay in centrally located accommodations to explore major sites on foot.
    - Try local foods like kebabs, baklava, and Turkish tea to immerse yourself in Turkish culture.
    - Respect local customs and dress modestly when visiting religious sites.`;
    
    

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
      });
  
     // console.log("Extracted Itinerary Response:", completion.choices[0].message.content);
  
      const places = extractPlacesFromItinerary(completion.choices[0].message.content);
     // After fetching or parsing your initial itinerary:
const parsedItinerary = parseItineraryResponse(completion.choices[0].message.content);
const restaurants = await fetchNearbyRestaurantForLastPlaces(parsedItinerary);

const itineraryWithRestaurants = addRestaurantsToItinerary(parsedItinerary, restaurants);
setItinerary(itineraryWithRestaurants);
console.log("Itinerary with restaurants:", itineraryWithRestaurants);

  
    } catch (error) {
      console.error("Error generating trip plan:", error);
    } finally {
      setIsLoading(false);
    }
    //send post request to backend
    try {
      const itineraryPost = {
        userId: user._id,
        itineraryEvents: itinerary,
        dateRange: {
          start: dateRange[0].toISOString(),
          end: dateRange[1].toISOString(),
        },
        tips: "Additional tips or comments here",
        photo: "URL to a relevant photo if applicable"
      };
    
      const response = await fetch(`${BASE_URL}/itinerary`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itineraryPost)
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
    
      const data = await response.json();
      console.log("Itinerary created successfully:", data);
    
    } catch (error) {
      console.error("Error:", error);
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
  onChange={(newValue) => {
    setDateRange(newValue);
    if (newValue[0] && newValue[1]) {
      const start = dayjs(newValue[0]);
      const end = dayjs(newValue[1]);
      const daysDiff = end.diff(start, 'day');

      if (daysDiff > 14) {
        setFormError("The selected date range should not exceed 14 days.");
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
      <TextField {...startProps} error={!!formError && !dateRange[0]} />
      <Box sx={{ mx: 2 }}>to</Box>
      <TextField {...endProps} error={!!formError && !dateRange[1]} />
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
  disabled={!isFormValid} // Use the isFormValid state to enable/disable the button
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
  {Object.entries(itinerary).map(([date, periods]) => (
    <Accordion key={date}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{`Day ${date}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Object.entries(periods).map(([period, activities]) => (
          <div key={period}>
            <Typography variant="h6" component="h2">{`${period.charAt(0).toUpperCase() + period.slice(1)}`}</Typography>
            <ul>
              {activities.map((activity, index) => (
                <li key={index}>
                  <strong>{activity.type === 'Place' ? 'Visit' : 'Eat at'}:</strong> {activity.name} - <em>{activity.activity}</em>
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
  );
}

export default Itineraries;
