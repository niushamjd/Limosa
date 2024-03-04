import React, { useState, useEffect, useContext } from 'react';
import '../styles/ınterest.css'; // Stil dosyasının adı doğru olmalı
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';

function Message({ message, onClose }) {
  return (
    <div className="message-container">
      <div className="message-content">
        {message}
        <button onClick={onClose} className="close-button">  X</button>
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
        setSuccessMessage("Interests updated successfully ");
        setShowMessage(true);
        window.scrollTo(0, 0); // Sayfanın en üstüne kaydır
      } else {
        console.error('Failed to update interests');
      }
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };
  

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

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
      {showMessage && <Message message={successMessage} onClose={handleCloseMessage} />}
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
};

export default Interest;
