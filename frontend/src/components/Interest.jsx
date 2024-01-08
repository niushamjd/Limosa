
import React, { useState } from 'react';
import '../style/Interest.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import historicalImage from '../assets/historical.jpg';
import cultureImage from '../assets/cultural.jpg';
import adventureImage from '../assets/adventure.jpeg';
import foodieImage from '../assets/foodie.jpg';
import artImage from '../assets/art.jpg';
import relaxImage from '../assets/relax.jpg';
import shopImage from '../assets/shopping.jpg';
import funImage from '../assets/fun.jpeg';
import natureImage from '../assets/nature.jpg';



function Interest () {
  

    const [selectedInterests, setSelectedInterests] = useState([]);
    const navigate = useNavigate();

  // Function to handle interest selection
  const toggleInterest = (interest) => {
    setSelectedInterests(prevSelectedInterests =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter(i => i !== interest) // Unselect
        : [...prevSelectedInterests, interest] // Select
    );
  };
  const isInterestSelected = (interest) => selectedInterests.includes(interest);
  
const handleSubmit = (e) => {
  e.preventDefault();

  axios.post("http://localhost:3001/interest", { selectedInterests })
    .then(res => {
      console.log(res);
      // Here you can redirect to profile or do something else
      navigate('/profile');
    })
    .catch(err => {
      console.log(err);
    });
}

const handleProfileRedirect = () => {
  navigate('/profile');
}
  const interests = [
    { name: 'History', image: historicalImage },
    { name: 'Culture', image: cultureImage },
    { name: 'Adventure', image: adventureImage },
    { name: 'Foodie', image: foodieImage },
    { name: 'Art', image: artImage },
    { name: 'Relaxation-lover', image: relaxImage },
    { name: 'Fun', image: funImage },
    { name: 'Nature', image: natureImage },
    { name: 'Shopping', image: shopImage },
    
  ];
  return (
<>
      <h2>Select Your Interests</h2>
      <form action="" onSubmit={handleSubmit}>
      <div className="image-grid">
        {interests.map(interest => (
          <div 
            key={interest.name}
            className={`image-card ${isInterestSelected(interest.name) ? 'selected' : ''}`}
            onClick={() => toggleInterest(interest.name)}
          >
            <img 
              src={interest.image} 
              alt={interest.name} 
              className={isInterestSelected(interest.name) ? 'selected-image' : ''}
            />
            <p>{interest.name}</p>
          </div>
        ))}
      </div>
      <div className="submit-container">
      <button type="submit" className="submit" onClick={handleProfileRedirect}>Save</button>
      
    </div>
    </form>
    </>
  );
};









   /* <div className="image-grid">
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
      <img src={artImage} alt="art" />
        <p>Art</p>
      </div>
      <div className="image-card">
      <img src={relaxImage} alt="relax" />
        <p>Relaxation-lover</p>
      </div>
      <div className="image-card">
      <img src={shopImage} alt="shopping" />
        <p>Shopping</p>
      </div>
      <div className="image-card">
      <img src={funImage} alt="fun" />
        <p>Fun</p>
      </div>
      <div className="image-card">
      <img src={natureImage} alt="nature" />
        <p>Nature</p>
      </div>
    </div>
    */
 

export default Interest;

