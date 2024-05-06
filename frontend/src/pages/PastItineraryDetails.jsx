import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Paper
} from '@mui/material';
import {
    LocationOn as LocationOnIcon,
    ExpandMore as ExpandMoreIcon,
  } from "@mui/icons-material";
import { BASE_URL } from '../utils/config';

function PastItineraryDetails() {
  const { itineraryId } = useParams();
  const [itineraryEvents, setItineraryEvents] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`);
        const data = await response.json();
        if (data.success) {
          setItineraryEvents(data.data.itineraryEvents);
          // Update expanded state to the first date
          const firstDate = Object.keys(data.data.itineraryEvents)[0];
          setExpanded(firstDate);
        } else {
          throw new Error('Failed to fetch itinerary details');
        }
      } catch (error) {
        console.error("Error fetching itinerary details:", error.message);
      }
    };
  
    fetchItineraryDetails();
  }, [itineraryId]);
  

  useEffect(() => {
    if (itineraryEvents && expanded) {
      loadGoogleMaps(initMap);
    }
  }, [itineraryEvents, expanded]);

  const loadGoogleMaps = (callback) => {
    if (window.google && window.google.maps) {
      callback();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8&libraries=&v=weekly`; // Replace YOUR_API_KEY with your actual API key
      document.head.appendChild(script);
      script.onload = callback;
    }
  };

  const initMap = () => {
    if (!itineraryEvents || !mapRef.current || !expanded) return;
  
    const dailyEvents = itineraryEvents[expanded];
    if (!dailyEvents) return;
  
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 37.7749, lng: -122.4194 }, // Default center, update as needed
    });
  
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
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
  
      const directionsService = new window.google.maps.DirectionsService();
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
  
  
  


  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (!itineraryEvents) {
    return <div>Loading or no itinerary events found.</div>;
  }

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", mt: 8 }}>
      <Box sx={{ flex: 1, overflowY: "auto", pr: 2 }}>
        <Typography variant="h4">Your Itinerary</Typography>
        {Object.entries(itineraryEvents).map(([date, periods]) => (
          <div key={date}>
            <Accordion
              expanded={expanded === date}
              onChange={handleAccordionChange(date)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <LocationOnIcon style={{ color: "orange" }} />
                <Typography sx={{ flexGrow: 1, marginLeft: "8px", fontSize: "1.6rem" }}>
                  {formatDate(date)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(periods).map(([period, activities]) => (
                  <Box key={period} sx={{ marginTop: 3 }}>
                    <Typography variant="h6" sx={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "#1e1930",
                      backgroundColor: "#FAA935",
                      padding: "8px",
                      borderRadius: "15px",
                    }}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Typography>
                    {activities.map((activity, index) => (
                      <Paper key={index} elevation={2} sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: "#fafafa",
                        borderRadius: "15px",
                      }}>
                        <Typography variant="h5">{activity.name}</Typography>
                        <Typography variant="body1" sx={{ color: "#424242", padding: "8px" }}>
                          {activity.activity}
                        </Typography>
                        {activity.photo && (
                          <img
                            src={activity.photo}
                            alt={activity.name}
                            style={{ width: "100%", marginTop: "8px" }}
                          />
                        )}
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

export default PastItineraryDetails;
