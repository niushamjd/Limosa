import React from 'react';
import { useLocation } from 'react-router-dom';

function ViewItinerary() {
  const location = useLocation();
  const itineraryData = location.state.itineraryData;

  // Inline CSS for centering
  const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '50vh', // This ensures that the flex container takes at least the full height of the viewport
  };

  return (
    <div style={centerStyle}>
      <div className="hero__content">
        <h1 className="services__title">Itinerary <span className="highlight">Details</span></h1>

        {itineraryData.events.map((event, index) => (
          <div key={index} className="experience__content" style={{ marginTop: '2rem' }}>
            <h2 className="featured__tour-title">{event.eventName}</h2>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Time: {new Date(event.timeRange.start).toLocaleTimeString()} - {new Date(event.timeRange.end).toLocaleTimeString()}</p>
            <p>Description: {event.description}</p>
            <p>Tips: {event.tips}</p>
            {/* Additional event details can be displayed here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewItinerary;
