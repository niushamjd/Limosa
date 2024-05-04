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
          loadGoogleMaps(initMap); // Load and initialize the map
        } else {
          throw new Error('Failed to fetch itinerary details');
        }
      } catch (error) {
        console.error("Error fetching itinerary details:", error.message);
      }
    };

    fetchItineraryDetails();
  }, [itineraryId]);

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

  const initMap = () => {
    if (!itineraryEvents || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 37.7749, lng: -122.4194 }, // San Francisco by default
    });

    // Add markers or other elements based on itineraryEvents
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
                        console.log(activity),  
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
