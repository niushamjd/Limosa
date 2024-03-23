import React, { useState, useEffect, useContext } from 'react';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';
import "../styles/travel-group.css";

function Message({ message }) {
    return (
      <div className="message-container">
        <div className="message-content">
          {message}
        </div>
      </div>
    );
}

function TravelGroup() {
  const [groupData, setGroupData] = useState({
    groupName: "",
    numberOfPeople: "",
    commonInterests: [],
  });
  const [interests, setInterests] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInterestChange = (e) => {
    const options = e.target.options;
    let selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    setGroupData(prevState => ({
      ...prevState,
      commonInterests: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error message
    setErrorMessage("");
    // Validation
    if (!groupData.groupName || !groupData.numberOfPeople || groupData.commonInterests.length === 0) {
      setErrorMessage("Please fill in all fields: Group Name, Number of People, and Mutual Interests.");
      setShowMessage(true);
      return; // Prevent form submission
    }

    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}/groups`, { // Adjusted endpoint for clarity
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groups: groupData }),
      });
      if (response.ok) {
        setSuccessMessage("Travel group created successfully");
        setShowMessage(true);
        window.scrollTo(0, 0);
      } else {
        setErrorMessage("Failed to create travel group");
        setShowMessage(true);
      }
    } catch (error) {
      setErrorMessage("Error creating travel group");
      setShowMessage(true);
    }
  };

  // Automatically close the message
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch(`${BASE_URL}/interests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
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
      {showMessage && <Message message={errorMessage || successMessage} />}
      <h2>Create a Travel Group</h2>
      <form className='group' onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="groupName">Group Name:</label>
          <input type="text" id="groupName" name="groupName" value={groupData.groupName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfPeople">Number of People:</label>
          <input type="number" id="numberOfPeople" name="numberOfPeople" value={groupData.numberOfPeople} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="interests">Select Mutual Interests:</label>
          <select id="commonInterest" name="commonInterest" multiple value={groupData.commonInterests} onChange={handleInterestChange}>
            {interests.map(interest => (
              <option key={interest.interestName} value={interest.interestName}>{interest.interestName}</option>
            ))}
          </select>
        </div>
        <div className="submit-container">
          <button type="submit" className="submit">Create Group</button>
        </div>
      </form>
    </>
  );
}

export default TravelGroup;
