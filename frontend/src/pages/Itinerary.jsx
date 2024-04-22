import React from 'react';
import { useLocation } from 'react-router-dom';

function Itinerary() {
  const location = useLocation(); // Get the state passed through navigation
  const { itinerary } = location.state; // Retrieve the itinerary

return (
  <div>
    <h2>Your Itinerary</h2>
    {Object.entries(itinerary).map(([date, periods]) => (
      <div key={date}>
        <h3>{date}</h3>
        {Object.entries(periods).map(([period, activities]) => (
          <div key={period}>
            <h4>{period}</h4>
            <ul>
              {activities.map((activity, index) => (
                <li key={index}>
                  <strong>{activity.type === "Place" ? "Visit" : "Eat at"}:</strong>
                  {activity.name} - <em>{activity.activity}</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ))}
  </div>
);
}


export default Itinerary;
