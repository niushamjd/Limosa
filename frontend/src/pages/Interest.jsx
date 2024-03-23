import React, { useState, useEffect, useContext } from 'react';
import '../styles/ınterest.css'; // Ensure the file name is correctly spelled
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';

function Message({ message }) {
  // Remove the close button's onClick event
  return (
    <div className="message-container">
      <div className="message-content">
        {message}
       
      </div>
    </div>
  );
}

function Interest() {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleInterest = (interest) => {
    setSelectedInterests(prevSelectedInterests =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter(i => i !== interest)
        : [...prevSelectedInterests, interest]
    );
  };

  const isInterestSelected = (interest) => selectedInterests.includes(interest);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });
      if (response.ok) {
        setSuccessMessage("Interests updated successfully");
        setShowMessage(true);
        window.scrollTo(0, 0); // Scroll to the top of the page
      } else {
        console.error('Failed to update interests');
      }
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1500); // Hide the message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or showMessage changes
    }
  }, [showMessage]);

  useEffect(() => {
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
      {showMessage && <Message message={successMessage} />}
      <h2>Select Your Interests</h2>
      <form onSubmit={handleSubmit}>
        <div className="image-grid">
          {interests.map(interest => (
            <div
              key={interest.interestName}
              className={`image-card ${isInterestSelected(interest.interestName) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest.interestName)}
            >
              <img
                src={`/interest-images/${interest.interestPhoto}`}
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
}

export default Interest;
