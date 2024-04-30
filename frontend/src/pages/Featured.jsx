import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/config";

const Featured = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    // Function to fetch all businesses
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/business`);
        if (response.ok) {
          const data = await response.json(); // Extract JSON data from the response
          console.log("Fetched businesses:", data.data); // Log the fetched data
          setBusinesses(data.data.filter(business => business.premium)); // Filter businesses with premium membership
        } else {
          throw new Error('Failed to fetch businesses');
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses(); // Call the fetch function when component mounts
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div>
      <h1>Featured</h1>
      <ul>
        {businesses.map((business) => (
          <li key={business._id}>
            <h2>{business.name}</h2>
            {business.type && <p>Type: {business.type}</p>}
            {business.openingHours && <p>Opening Hours: {business.openingHours}</p>}
            <p>Contact Details:</p>
            <ul>
              {business.contactDetails.phone && <li>Phone: {business.contactDetails.phone}</li>}
              {business.contactDetails.email && <li>Email: {business.contactDetails.email}</li>}
              {business.contactDetails.website && <li>Website: {business.contactDetails.website}</li>}
              {business.contactDetails.address && (
                <li>
                  Address: {business.contactDetails.address.street},{" "}
                  {business.contactDetails.address.city},{" "}
                  {business.contactDetails.address.state},{" "}
                  {business.contactDetails.address.zipCode},{" "}
                  {business.contactDetails.address.country}
                </li>
              )}
            </ul>
            <p>Special Offers:</p>
            <ul>
              {business.specialOffers.map((offer, index) => (
                <li key={index}>
                  <strong>{offer.title}</strong>: {offer.description} (Valid
                  from {new Date(offer.startDate).toLocaleDateString()} to{" "}
                  {new Date(offer.endDate).toLocaleDateString()})
                </li>
              ))}
            </ul>
            {business.events.length > 0 && ( // Conditionally render "Events" section if there are events
              <>
                <p>Events:</p>
                <ul>
                  {business.events.map((event, index) => (
                    <li key={index}>
                      <strong>{event.eventName}</strong>: {event.eventDescription}{" "}
                      (Date: {new Date(event.eventDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p>Premium: {business.premium ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Featured;
