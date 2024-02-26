import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./itinerary-card.css"; // Assuming a separate CSS file for itinerary cards

const ItineraryCard = ({ itinerary }) => {
  const { _id, destination, photo } = itinerary;
  // Assuming you want to display a placeholder for origin and price since they are not available in the itinerary model
  const origin = "Origin"; 
  const price = "Price";

  return (
    <div className="itinerary__card">
      <Card>    
        <div className="itinerary__img">
          <img src={photo} alt="itinerary-img" />
        </div>
        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="itinerary__location d-flex align-items-center gap-1 ">
              <i className="ri-map-pin-line"></i> {origin} to {destination}
            </span>
          </div>
          <h5 className="itinerary__title">
            <Link to={`/itineraries/${_id}`}>{destination}</Link>
          </h5>
          <div className="itinerary__details mt-3">
            {/* Display budget and interests if available */}
            <p>Budget: {itinerary.budget}</p>
            <p>Interests: {itinerary.interests.join(", ")}</p>
          </div>
          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              €{price} <span>/until 8 person</span>
            </h5>
            <button className="btn booking__btn">
              <Link to={`/itineraries/${_id}`}>Book Now</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ItineraryCard;
