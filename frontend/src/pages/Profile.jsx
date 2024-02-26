import React, { useContext } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/profile.css";
import Newsletter from "../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <CommonSection title={"Edit your Profile"} />
      <section className="profile__section">
        <Container>
          <Row>
            <Col>
              {user ? (
                <>
                  <h2>Username: {user.username}</h2>
                  <p>Email: {user.email}</p>
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
