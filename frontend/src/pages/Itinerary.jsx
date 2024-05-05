import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { red } from "@mui/material/colors"; // Import red color from MUI's color palette
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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { orange } from '@mui/material/colors';


function Itinerary() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const location = useLocation();
  const locationState = location.state || {};
  const [itinerary, setItinerary] = useState(locationState.itinerary);
  const mapRef = useRef(null);
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer();
  const [expanded, setExpanded] = useState(() => {
    if (
      locationState.itinerary &&
      Object.keys(locationState.itinerary.itineraryEvents).length > 0
    ) {
      const firstDay = Object.keys(locationState.itinerary.itineraryEvents)[0];
      return firstDay;
    }
    return "";
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : "");
  };

  const handleDragStart = (event, date) => {
    event.dataTransfer.setData("text/plain", date);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, targetDate) => {
    event.preventDefault();
    const draggedDate = event.dataTransfer.getData("text/plain");
    const updatedItinerary = { ...itinerary };
    const draggedDay = updatedItinerary.itineraryEvents[draggedDate];
    const targetDay = updatedItinerary.itineraryEvents[targetDate];

    // Swapping days
    updatedItinerary.itineraryEvents[targetDate] = draggedDay;
    updatedItinerary.itineraryEvents[draggedDate] = targetDay;

    setItinerary(updatedItinerary);

    try {
      const response = await fetch(
        `${BASE_URL}/itinerary/update-days/${itinerary._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newDays: updatedItinerary.itineraryEvents }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update the database: " + data.message);
      }
      setSnackbarMessage("Itinerary days updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error updating itinerary days: " + error.message);
      setSnackbarOpen(true);
    }
  };

  const loadGoogleMaps = (callback) => {
    if (window.google) {
      callback();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8`;
      document.head.appendChild(script);
      script.onload = () => {
        callback(); // Initialize map after the script is loaded
      };
    }
  };

  const initMap = () => {
    if (!itinerary || !mapRef.current || !expanded) return;

    const dailyEvents = itinerary.itineraryEvents[expanded];
    if (!dailyEvents) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 37.7749, lng: -122.4194 }, // Default center, update as needed
    });
    directionsRenderer.setMap(map);

    const eventCoordinates = [];

    ["morning", "afternoon", "evening"].forEach((period) => {
      dailyEvents[period]?.forEach((event) => {
        if (event.coordinates) {
          eventCoordinates.push({
            location: new window.google.maps.LatLng(
              event.coordinates.latitude,
              event.coordinates.longitude
            ),
          });
          new window.google.maps.Marker({
            position: {
              lat: event.coordinates.latitude,
              lng: event.coordinates.longitude,
            },
            map: map,
            title: event.name,
          });
        }
      });
    });

    if (eventCoordinates.length > 1) {
      const waypoints = eventCoordinates
        .slice(1, eventCoordinates.length - 1)
        .map((coord) => ({ location: coord.location, stopover: true }));
      const origin = eventCoordinates[0].location;
      const destination =
        eventCoordinates[eventCoordinates.length - 1].location;

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  };

  useEffect(() => {
    const loadGoogleMaps = (callback) => {
      if (window.google && window.google.maps) {
        callback();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8&libraries=&v=weekly`;
        document.head.appendChild(script);
        script.onload = callback;
      }
    };

    loadGoogleMaps(initMap);
  }, [itinerary, expanded]); // Now depends on `expanded`

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
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ 
              width: '100%',
              backgroundColor: orange[400], // Turuncu arka plan rengi
              color: '#fff', // Beyaz metin rengi
              fontSize: '1.2rem', // Yazı tipi boyutu
           }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        {Object.entries(itinerary.itineraryEvents).map(([date, periods]) => (
          <div
            key={date}
            draggable
            onDragStart={(event) => {
              handleDragStart(event, date);
              event.currentTarget.style.opacity = "0.5"; // Reduce opacity when dragging
            }}
            onDragEnd={(event) => {
              event.currentTarget.style.opacity = "1"; // Reset opacity after dragging
            }}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, date)}
            style={{
              cursor: "grab", // Cursor indicates item can be grabbed
              marginBottom: "10px", // Maintain margin for visual separation during drag
            }}
          >
            <Accordion
              expanded={expanded === date}
              onChange={handleAccordionChange(date)}
              TransitionProps={{ unmountOnExit: true }} // Helps with performance by unmounting offscreen content
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <LocationOnIcon style={{ color: "orange" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      flexGrow: 1,
                      marginLeft: "8px",
                      fontSize: "1.6rem",
                    }}
                  >
                    {formatDate(date)}
                  </Typography>
                  <Button
                    onClick={() => handleDelete(date)}
                    variant="contained"
                    color="error"
                    style={{ borderRadius: "16px" }}
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
                        borderRadius: "15px", // Rounded corners for smooth edges
                      }}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Typography>
                    {activities.map((activity, index) => (
                      <Paper
                        key={index}
                        elevation={2}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: "#fafafa",
                          borderRadius: "15px",
                        }}
                      >
                        <Typography variant="h5">{activity.name}</Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#424242", padding: "8px" }}
                        >
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
                            borderRadius: "15px",
                            textTransform: "none", // No uppercase transformation
                          }}
                        >
                          <span style={{ fontWeight: 600, color: red[500] }}>
                            Delete
                          </span>{" "}
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </Box>
      <Box sx={{ flex: 1, minHeight: "100%" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </Box>
    </Box>
  );
}

export default Itinerary;
