import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  useEffect(() => {
    // This will re-initialize the state when location state changes
    setItinerary(location.state.itinerary);
  }, [location.state.itinerary]);

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
                <Box key={period}>
                  <Typography variant="h6">
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
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleDelete(date, period, activity.name)
                        }
                        sx={{ mt: 2 }}
                      >
                        Delete
                      </Button>
                    </Paper>
                  ))}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Box sx={{ flex: 1, minHeight: "100%" }}>
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.4920654559354!2d-122.4194157!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064!2zU2FuIEZyYW5jaXNjbywgQ0Eg!5e0!3m2!1sen!2sus!4v1641861192787"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: "none" }}
          allowFullScreen
        />
      </Box>
    </Box>
  );
}

export default Itinerary;
