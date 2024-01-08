import React from 'react';
import '../style/TravelPlan.css';



const TravelPlan = ({ data }) => {
  return (
    <div className="travel-plan">
      <h2>Travel Plan</h2>
      <ul>
        <li><strong>Destination:</strong> {data.destination}</li>
        <li><strong>Date Range:</strong> {data.dateRange[0]} to {data.dateRange[1]}</li>
        <li><strong>People Group:</strong> {data.peopleGroup}</li>
        <li><strong>Budget:</strong> {data.budget}</li>
      </ul>
    </div>
  );
};

export default TravelPlan;
