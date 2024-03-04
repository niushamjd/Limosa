import React, { useState, useEffect, useContext } from 'react';
import '../styles/ınterest.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';

function Interest() {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Function to handle interest selection
  const toggleInterest = (interest) => {
    setSelectedInterests(prevSelectedInterests =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter(i => i !== interest) // Unselect
        : [...prevSelectedInterests, interest] // Select
    );
  };

  const isInterestSelected = (interest) => selectedInterests.includes(interest);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send selected interests to the backend
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });
      if (response.ok) {
        console.log('Interests updated successfully');
        // Redirect to profile page or perform any other action after saving
        navigate('/profile');
      } else {
        console.error('Failed to update interests');
      }
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };

  useEffect(() => {
    // Fetch interests from the backend
    const fetchInterests = async () => {
      try {
        const response = await fetch(`${BASE_URL}/interests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const data = await response.json();
          setInterests(data.data);
        } else {
          console.error('Failed to fetch interests');
        }
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []);

  return (
    <>
      <h2>Select Your Interests</h2>
      {user.interests}
      <form onSubmit={handleSubmit}>
        <div className="image-grid">
          {interests.map(interest => (
            <div
              key={interest.interestName}
              className={`image-card ${isInterestSelected(interest.interestName) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest.interestName)}
            >
              <img
                src={`../assets/images/${interest.interestPhoto}`}
                alt={interest.interestName}
                className={isInterestSelected(interest.interestName) ? 'selected-image' : ''}
              />
              <p>{interest.interestName}</p>
            </div>
          ))}
        </div>
        <div className="submit-container">
          <button type="submit" className="submit">Save</button>
        </div>
      </form>
    </>
  );
};

export default Interest;
