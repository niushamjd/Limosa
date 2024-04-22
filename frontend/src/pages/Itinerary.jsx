import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_URL } from "../utils/config";

function Itinerary() {
  const location = useLocation();
  const { itinerary } = location.state || {}; // Ensure fallback to prevent errors
  console.log("Itinerary object:", itinerary);
  console.log("Itinerary ID:", itinerary._id);
  console.log("Itinerary Events:", itinerary.itineraryEvents);

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
      {Object.entries(itinerary.itineraryEvents).map(([date, periods]) => (
        <div key={date}>
          <h3>{date}</h3>
          {Object.entries(periods).map(([period, activities]) => (
            <div key={period}>
              <h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>
                    <strong>{activity.type === "Place" ? "Visit" : "Eat at"}:</strong>
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
        </div>
      ))}
    </div>
  );
}

export default Itinerary;
