import React, { useContext } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/profile.css";
import Newsletter from "../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'; 

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Navigation functions
  const goToPastItinerary = () => {
    navigate('/viewpastitinerary');
  };

  const goToEditProfile = () => {
    navigate('/editprofile');
  };

  const goToInterest = () => {
    navigate('/interest');
  };

  const goToGroup = () => {
    navigate('/travelgroup');
  };

  const goToConnect = () => {
    navigate('/connect');
    //go to top of the page
    window.scrollTo(0, 0);
  };

  const goToBusinessProfile = () => {
    navigate('/business');
  };

  return (
    <>
      <CommonSection title={"Welcome " + user.username} />
      <section className="profile__section">
        <Container>
          <Row>
            <Col>
              {user ? (
                <>
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
                      <div className="settings-item" onClick={goToConnect}>
                        <div className="text-content">
                          <h3>Connect with Friends</h3>
                          <p>Connect with your friends to form travel groups</p>
                        </div>
                      </div>
                      {/* Business profile section for users with 'business' role */}
                      {user.role === 'business' && (
                        <div className="settings-item" onClick={goToBusinessProfile}>
                          <div className="text-content">
                            <h3>Create Your Business Profile</h3>
                            <p>Set up and manage your business profile</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p>Please log in first.</p>
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
