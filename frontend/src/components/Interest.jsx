import React from 'react';
import '../style/Interest.css'
import historicalImage from '../assets/historical.jpg';
import cultureImage from '../assets/cultural.jpg';
import adventureImage from '../assets/adventure.jpeg';
import foodieImage from '../assets/foodie.jpg';

const Interest = () => {
  return (

    <div className="image-grid">
      <div className="image-card">
      <img src={historicalImage} alt="History" />
        <p>History</p>
      </div>
      <div className="image-card">
      <img src={cultureImage} alt="culture" />
        <p>Culture</p>
      </div>
      <div className="image-card">
      <img src={adventureImage} alt="adventure" />
        <p>Adventure</p>
      </div>
      <div className="image-card">
      <img src={foodieImage} alt="foodie" />
        <p>Foodie</p>
      </div>
      <div className="image-card">
      <img src={cultureImage} alt="culture" />
        <p>Culture</p>
      </div>
      <div className="image-card">
      <img src={cultureImage} alt="culture" />
        <p>Culture</p>
      </div>
      <div className="image-card">
      <img src={cultureImage} alt="culture" />
        <p>Culture</p>
      </div>
      <div className="image-card">
      <img src={cultureImage} alt="culture" />
        <p>Culture</p>
      </div>
      <div className="image-card">
      <img src={cultureImage} alt="culture" />
        <p>Culture</p>
      </div>
    </div>
  );
};

export default Interest;

