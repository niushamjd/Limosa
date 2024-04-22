import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { LocationOn as LocationOnIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { BASE_URL } from "../utils/config";

function Itinerary() {
  const location = useLocation();
  const { itinerary } = location.state || {}; // Ensure fallback to prevent errors
  console.log("Itinerary object:", itinerary);
  console.log("Itinerary ID:", itinerary._id);
  console.log("Itinerary Events:", itinerary.itineraryEvents);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
  };

  if (!itinerary) {
    return <div>No itinerary data found.</div>; // Handling case where itinerary is not present
  }

  const handleDelete = async (date, period, eventName) => {
    console.log("Deleting event with ID:", itinerary._id, " Event: ", eventName);
    try {
      const response = await fetch(`${BASE_URL}/itinerary/delete-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          itineraryId: itinerary._id,
          date,
          period,
          eventName
        }),
      });
      if (!response.ok) throw new Error(`Failed to delete event: ${response.statusText}`);
      console.log('Event deleted successfully');
      // Optionally trigger a re-fetch or update local state to reflect changes
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div>
    <h2>Your Itinerary</h2>
    {Object.keys(itinerary.itineraryEvents).length > 0 && (
      <div className="itinerary-accordion">
        {Object.entries(itinerary.itineraryEvents).map(([date, periods]) => (
          <Accordion key={date}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <LocationOnIcon style={{ color: 'orange' }} />
            <Typography style={{ marginLeft: '8px' }}>{formatDate(date)}</Typography>
              </AccordionSummary>
            <AccordionDetails>
              {Object.entries(periods).map(([period, activities]) => (
                <div key={period}>
                  <Typography variant="h6" component="h2">{`${period.charAt(0).toUpperCase() + period.slice(1)}`}</Typography>
                    <ul>
                    {activities.map((activity, index) => (
                      <li key={index}>
                        <strong>
                          {activity.type === "Place" ? "Visit" : "Eat at"}:
                        </strong>{" "}
                        {activity.name} - <em>{activity.activity}</em>
                        <Button
                          size="small"
                          onClick={() => handleDelete(date, period, activity.name)}
                          startIcon={<DeleteIcon />}
                          style={{ marginLeft: '10px' }}
                        >
                          Delete
                        </Button>
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

export default Itinerary;