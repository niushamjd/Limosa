import React, { useEffect, useState, useContext } from 'react';
import "../styles/ItineraryGrid.css";
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';

function ViewPastItinerary() {
  const { user } = useContext(AuthContext);
  const userId = user._id;
  const [itineraryData, setItineraryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/itinerary/user/${userId}`);
        const data = await response.json();
        if (data.success) {
          setItineraryData(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    fetchItineraries();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading itineraries: {error.message}</div>;
  }

  return (
    <div className="itinerary-grid">
      {itineraryData.map((itinerary, index) => (
        <div key={index} className="itinerary-card">
          <div className="itinerary-card__info">
            {Object.entries(itinerary.itineraryEvents).map(([date, sessions], idx) => (
              <div key={idx}>
                <h2>{date}</h2>
                {Object.entries(sessions).map(([session, events], sessionIdx) => (
                  <div key={sessionIdx}>
                    <h3>{session.charAt(0).toUpperCase() + session.slice(1)}</h3> {/* Capitalize session name */}
                    {events.map((event, eventIdx) => (
                      <p key={eventIdx}>
                        {event.name}: {event.activity}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <p className="itinerary-card__tips">{itinerary.tips}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewPastItinerary;
