import React, { useEffect, useContext } from "react";
import "../styles/itinerary-details.css"; // Updated CSS file for itinerary details
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Newsletter from "../shared/Newsletter";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const ItineraryDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // Fetch data from the database
  const { data: itinerary, loading, error } = useFetch(`${BASE_URL}/itineraries/${id}`);
  const { destination, budget, interests } = itinerary;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itinerary]);

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading...</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="itinerary__content">
                  {/* You can replace this with an image related to the itinerary */}
                  <img src="placeholder.jpg" alt={destination} />

                  <div className="itinerary__info">
                    <h2>{destination}</h2>
                    <div className="itinerary__extra-details">
                      <span>
                        <i className="ri-wallet-line"></i> {budget}
                      </span>
                      {/* Render interests if available */}
                      {interests && (
                        <span>
                          <i className="ri-heart-line"></i> {interests.join(", ")}
                        </span>
                      )}
                    </div>
                    <h5>Description</h5>
                    <p>
                      {/* Add itinerary description here */}
                    </p>
                  </div>
                </div>
              </Col>
              {/* You may add additional components related to itinerary booking here */}
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default ItineraryDetails;
