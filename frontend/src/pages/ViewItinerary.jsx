import React from 'react';
import { useLocation } from 'react-router-dom';

function ViewItinerary() {
  const location = useLocation();
  const itineraryData = location.state.itineraryData; // Assuming this is how you've structured the state

  return (
    <div>
      <h1>Itinerary Details</h1>
      <p>Title: {itineraryData.itinerary.title}</p>
      {/* Display other itinerary details as needed */}

      <h2>Events:</h2>
      {itineraryData.events.map((event, index) => (
        <div key={index}>
          <h3>{event.eventName}</h3>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
          <p>Description: {event.description}</p>
          {/* Display other event details as needed */}
        </div>
      ))}
    </div>
  );
}

export default ViewItinerary;
