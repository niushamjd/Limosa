import React from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/ItineraryGrid.css";



function ViewPastItinerary() {
  const location = useLocation();
  const itineraryData = location.state.itineraryData;


  const formatEventDate = (isoDateString) => {
    return new Date(isoDateString).toLocaleDateString();
  };
  

  const formatDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} Days`;
  };

  return (
    <div className="itinerary-grid">
      {itineraryData.events.map((event, index) => {
        const cityImage = require(`../assets/images/${event.location.toLowerCase()}.jpg`);
        return (
          <div key={index} className="itinerary-card">
            <div className="itinerary-card__image">
              <img src={cityImage} alt={event.eventName} />
            </div>
            <div className="itinerary-card__info">
              <h2 className="itinerary-card__title">{event.location}</h2>
              <p className="itinerary-card__date">
                {formatEventDate(event.date)} · {formatDuration(event.timeRange.start, event.timeRange.end)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ViewPastItinerary;