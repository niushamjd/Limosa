import React, { useEffect, useContext } from "react";
import "../styles/itinerary-details.css"; // Your CSS file for itinerary details
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Newsletter from "../shared/Newsletter";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const ItineraryDetails = () => {
  const { id } = useParams(); // Get the itinerary ID from the URL parameters
  const { user } = useContext(AuthContext);

  // Fetch the itinerary data from the backend using the ID from the URL
  const { data: itinerary, loading, error } = useFetch(`${BASE_URL}/itineraries/${id}`);

  // Scroll to the top of the page when the itinerary is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itinerary]);

  if (loading) {
    return <h4 className="text-center pt-5">Loading...</h4>;
  }

  if (error) {
    return <h4 className="text-center pt-5">{error}</h4>;
  }

  if (!itinerary) {
    return null; // or some fallback content
  }

  // Extract relevant data from the fetched itinerary
  const { destination, budget, interests, description } = itinerary;

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="itinerary__content">
                {/* Replace the placeholder image with an actual image if you have one */}
                <img src="placeholder.jpg" alt={destination} className="itinerary__image" />

                <div className="itinerary__info">
                  <h2>{destination}</h2>
                  <div className="itinerary__extra-details">
                    <span>
                      <i className="ri-wallet-line"></i> {budget}
                    </span>
                    {/* Render interests if they are available */}
                    {interests && (
                      <span>
                        <i className="ri-heart-line"></i> {interests.join(", ")}
                      </span>
                    )}
                  </div>
                  <h5>Description</h5>
                  <p>{description}</p> {/* Render the itinerary description */}
                </div>
              </div>
            </Col>
            {/* Additional columns or components can be added here as needed */}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default ItineraryDetails;