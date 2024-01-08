import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/TravelGroup.css'; // Importing the CSS file

function TravelGroup() {
  const [groupName, setGroupName] = useState('');
  const [groupCount, setGroupCount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/endpoint', { groupName, groupCount }); // Replace '/api/endpoint' with your actual API endpoint
      navigate('../profile');
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  const handleProfileRedirect = () => {
    navigate('/profile');
  }

  return (

    
    <form onSubmit={handleSubmit} className="travel-group-form">
        <div className="header">
        <div className="text">Travel Group</div>
        <div className="underline"></div>
      </div>
      <div className="form-group">
        <label htmlFor="groupName">Group Name</label>
        <select id="groupName" value={groupName} onChange={e => setGroupName(e.target.value)}>
          <option value="">Select Group</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Business">Business</option>
          <option value="Couple">Couple</option>
          <option value="School">School</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="groupCount">Group Count</label>
        <input type="number" id="groupCount" value={groupCount} onChange={e => setGroupCount(e.target.value)} min="0" max="100" />
      </div>

      <button type="submit" className="save-btn" onClick={handleProfileRedirect}>Save</button>
    </form>
  );
}

export default TravelGroup;
