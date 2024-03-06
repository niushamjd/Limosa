import React, { useState, useEffect, useContext } from 'react';
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
function TravelGroup() {
  const [groupData, setGroupData] = useState({
    groupName: "",
    numberOfPeople: "",
    commonInterests: [],
  });
  const [interests, setInterests] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
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
    const commonInterests = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        commonInterests.push(options[i].value);
      }
    }
    setGroupData(prevState => ({
      ...prevState,
      commonInterests: [...prevState.commonInterests, ...commonInterests]
    }));
  };
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${BASE_URL}/users/${user._id}`, {
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
        console.log(groupData)
      } else {
        console.error('Failed to create travel group');
      }
    } catch (error) {
      console.error('Error creating travel group:', error);
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
      <h2>Create a Travel Group</h2>
      <form onSubmit={handleSubmit}>
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
