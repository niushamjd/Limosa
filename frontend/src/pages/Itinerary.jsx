import React from 'react';
import { useLocation } from 'react-router-dom';

function Itinerary() {
  const location = useLocation(); // Get the state passed through navigation
  const { itinerary } = location.state; // Retrieve the itinerary

  return (
    <div>
      <h2>Your Itinerary</h2>
      <pre>{itinerary}</pre> {/* Display the itinerary */}
    </div>
  );
}

export default Itinerary;
