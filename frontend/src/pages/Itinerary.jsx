import React, { useState, useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
import { red,deepOrange } from "@mui/material/colors"; // Import red color from MUI's color palette
import {
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../utils/config";

function Itinerary() {
  const location = useLocation();
  const locationState = location.state || {};
  const [itinerary, setItinerary] = useState(locationState.itinerary);
  const mapRef = useRef(null);

  const loadGoogleMaps = (callback) => {
    if (window.google) {
      callback();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8`;
      document.head.appendChild(script);
      script.onload = () => {
        callback(); // Initialize map after the script is loaded
      };
    }
  };


  const initMap = () => {
    if (!itinerary || !mapRef.current) return;

    let centerLat = 37.7749; // Default latitude
    let centerLng = -122.4194; // Default longitude
    let firstEventFound = false;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: centerLat, lng: centerLng },
    });

    Object.entries(itinerary.itineraryEvents).forEach(([date, dailyEvents]) => {
      ['morning', 'afternoon', 'evening'].forEach(period => {
        dailyEvents[period]?.forEach(event => {
          if (event.coordinates && !firstEventFound) {
            centerLat = event.coordinates.latitude;
            centerLng = event.coordinates.longitude;
            map.setCenter({ lat: centerLat, lng: centerLng });
            firstEventFound = true; // Ensures that the map centers on the first event found
          }
          if (event.coordinates) {
            new window.google.maps.Marker({
              position: { lat: event.coordinates.latitude, lng: event.coordinates.longitude },
              map: map,
              title: event.name,
            });
          }
        });
      });
    });
  };

  useEffect(() => {
    if (window.google && itinerary) {
      initMap();
    } else if (!window.google) {
      loadGoogleMaps(initMap);
    }
  }, [location.state.itinerary, itinerary]); // Dependency array includes itinerary to reinitialize the map on data change


  if (!itinerary) {
    return <div>No itinerary data found.</div>;
  }



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleDelete = async (date, period = null, eventName = null) => {
    const isDeletingDay = !period && !eventName; // Check that both are null to decide to delete the whole day
    const body = isDeletingDay
      ? { itineraryId: itinerary._id, date, deleteType: "day" }
      : {
          itineraryId: itinerary._id,
          date,
          period,
          eventName,
          deleteType: "part",
        };

    try {
      const response = await fetch(`${BASE_URL}/itinerary/delete-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok)
        throw new Error(`Failed to delete: ${response.statusText}`);
      console.log("Deletion successful");

      // Update state to reflect the changes
      if (isDeletingDay) {
        const updatedItinerary = { ...itinerary };
        delete updatedItinerary.itineraryEvents[date];
        setItinerary(updatedItinerary);
      } else {
        const updatedItinerary = { ...itinerary };
        updatedItinerary.itineraryEvents[date][period] =
          updatedItinerary.itineraryEvents[date][period].filter(
            (event) => event.name !== eventName
          );
        setItinerary(updatedItinerary);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", mt: 8 }}>
      <Box sx={{ flex: 1, overflowY: "auto", pr: 2 }}>
        <Typography variant="h4">Your Itinerary</Typography>
        {Object.entries(itinerary.itineraryEvents).map(([date, periods]) => (
          <Accordion key={date}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <LocationOnIcon style={{ color: "orange" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography style={{ marginLeft: "8px" }}>
                  {formatDate(date)}
                </Typography>
                <Button
                  onClick={() => handleDelete(date)}
                  variant="contained"
                  color="error"
                  sx={{ borderRadius: "16px" }}
                >
                  Delete Day
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(periods).map(([period, activities]) => (
                <Box key={period} sx={{ marginTop: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.5rem", // Increased font size
                      fontWeight: 600, // Semi-bold for emphasis
                      color: "#1e1930", // Using a bold color for contrast
                      backgroundColor: "#FAA935", // Light background color
                      padding: "8px", // Padding for comfort
                      borderRadius: "4px", // Rounded corners for smooth edges
                    }}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Typography>
                  {activities.map((activity, index) => (
                    <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h5">{activity.name}</Typography>
                      <Typography variant="body1">
                        {activity.activity}
                      </Typography>
                      {activity.photo && (
                        <img
                          src={activity.photo}
                          alt={activity.name}
                          style={{ width: "100%", marginTop: "8px" }}
                        />
                      )}
                      <Button
                        size="small"
                        startIcon={
                          <DeleteIcon
                            fontSize="medium" // Standardized icon size
                            sx={{ color: red[500] }} // Icon color to match the button's error theme
                          />
                        }
                        onClick={() =>
                          handleDelete(date, period, activity.name)
                        }
                        sx={{
                          mt: 2,
                          padding: "8px 16px", // Adding padding for a better feel
                          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Subtle shadow effect
                          borderRadius: "8px", // Rounded corners for a more refined look
                          textTransform: "none", // No uppercase transformation
                        }}
                      >
                        <span style={{ fontWeight: 600, color: red[500] }}>
                          Delete
                        </span>{" "}
                        {/* Making text bold */}
                      </Button>
                    </Paper>
                  ))}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Box sx={{ flex: 1, minHeight: '100%' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      </Box>
    </Box>
  );
}

export default Itinerary;
