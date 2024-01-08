import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../style/Profile.css';
import profileImage from '../assets/profileImage.png';

// Icons can be imported from a library like react-icons or any other icon set you prefer
//import { IoIosArrowForward } from 'react-icons/io'; // Example icon for the arrow

const Profile = () => {
    const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle navigation to the past itinerary
  const goToPastItinerary = () => {
    navigate('/travelplan');
  };

  // Function to handle navigation to edit profile
  const goToEditProfile = () => {
    navigate('/editprofile');
  };

  const goToInterest = () => {
    navigate('/interest');
  };

  const goToGroup = () => {
    navigate('/travelgroup');
  };

  


  return (
    <div className="profile-container">
      <div className="profile-settings">
        <div className="settings-item" onClick={goToPastItinerary}>
          <div className="text-content">
            <h3>View Past Itinerary</h3>
            <p>Review the details and experiences of your generated trips</p>
          </div>
        </div>
        <div className="settings-item" onClick={goToEditProfile}>
          <div className="text-content">
            <h3>Edit Profile</h3>
            <p>Edit your profile information, including name and date of birth.</p>
          </div>
        </div>
        <div className="settings-item" onClick={goToInterest}>
          <div className="text-content">
            <h3>Specify Interest</h3>
            <p>Specify your exact interests for customized itinerary</p>
          </div>
        </div>
        <div className="settings-item" onClick={goToGroup}>
          <div className="text-content">
            <h3>Travel Group</h3>
            <p>Plan a travel for your special group</p>
          </div>
        </div>
      </div>
      <div className="profile-image">
        <img src={profileImage} alt="Profile" />
      </div>
    </div>
  );
};


export default Profile;
