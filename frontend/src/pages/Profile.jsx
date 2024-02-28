import React, { useContext } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/profile.css";
import Newsletter from "../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'; 

const Profile = () => {
  const { user } = useContext(AuthContext);

  
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
    <>
      <CommonSection title={"Edit your Profile"} />
      <section className="profile__section">
        <Container>
          <Row>
            <Col>
              {user ? (
                <>
                  <h2>Welcome  {user.username}</h2>
                  {/* <p>Email: {user.email}</p> */}

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
      
    </div>
                  
                </>
              ) : (
                <p>Please log in first.
                </p>
               
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Profile;
