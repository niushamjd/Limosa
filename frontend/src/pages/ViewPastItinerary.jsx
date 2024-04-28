import React, { useEffect, useState, useContext } from 'react';
import "../styles/ItineraryGrid.css";
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';

function ViewPastItinerary() {
  const { user } = useContext(AuthContext);
  const userId = user._id;
  const [itineraryData, setItineraryData] = useState([]);
  const [editState, setEditState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItineraries();
  }, [userId]);

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

  const deleteItinerary = async (itineraryId) => {
    try {
      const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setItineraryData(itineraryData.filter(itinerary => itinerary._id !== itineraryId));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
  };

  const startEditing = (itineraryId) => {
    const itinerary = itineraryData.find(it => it._id === itineraryId);
    setEditState({
      _id: itinerary._id,
      name: itinerary.name || '',  // Ensure default empty string if undefined
      tips: itinerary.tips || '',  // Ensure default empty string if undefined
      editing: true
    });
  };
  

  const handleChange = (e, field) => {
    setEditState({
      ...editState,
      [field]: e.target.value
    });
  };


  const saveChanges = async (itineraryId) => {
    try {
      const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editState.name,
          tips: editState.tips
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchItineraries();
        setEditState({}); // Reset edit state
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
  };
  

  const cancelEditing = () => {
    setEditState({});
  };

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
            {editState._id === itinerary._id ? (
              <div>
                <input
                  type="text"
                  value={editState.name || ''}
                  onChange={(e) => handleChange(e, 'name')}
                  placeholder="Itinerary Name"
                />
                <textarea
                  value={editState.tips || ''}
                  onChange={(e) => handleChange(e, 'tips')}
                  placeholder="Additional Tips"
                />
                <button onClick={() => saveChanges(itinerary._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>{itinerary.name}</h2>
                <p>Notes: {itinerary.tips}</p>
                <button onClick={() => deleteItinerary(itinerary._id)}>Delete Itinerary</button>
                <button onClick={() => startEditing(itinerary._id)}>Modify Itinerary</button>
                <p>Destination: {itinerary.city}</p>
                <p>Group: {itinerary.group}</p>
                <p>Budget: {itinerary.budget}</p>
              </div>
            )}
            {Object.entries(itinerary.itineraryEvents).map(([date, sessions], idx) => (
              <div key={idx}>
                <h3>{date}</h3>
                {Object.entries(sessions).map(([session, events], sessionIdx) => (
                  <div key={sessionIdx}>
                    <h4>{session.charAt(0).toUpperCase() + session.slice(1)}</h4>
                    {events.map((event, eventIdx) => (
                      <p key={eventIdx}>
                        {event.name}: {event.activity}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewPastItinerary;
