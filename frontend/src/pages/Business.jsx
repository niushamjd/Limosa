import React, { useState, useMemo } from 'react';
import { TextField, Button, Box, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { BASE_URL } from "../utils/config";
import { fetchPlaceDetails } from '../services/RestaurantService';
import { useLoadScript } from '@react-google-maps/api';
import '../styles/business.css'; 
function Business() {
  // State to store input form data
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    openingHours: '',
    contactDetails: {
      phone: '',
      email: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    specialOffers: [],
    events: [],
    premium: true // Default premium value
  });
  const [errorMessage, setErrorMessage] = useState('');
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8", // Replace with your actual Google Maps API key
    libraries,
  });
 
  const addSpecialOffer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prevState => {
      const lastOffer = prevState.specialOffers[prevState.specialOffers.length - 1];
      if (!lastOffer || (lastOffer.title.trim() !== '' && lastOffer.description.trim() !== '')) {
        return {
          ...prevState,
          specialOffers: [...prevState.specialOffers, { title: '', description: '' }]
        };
      }
      return prevState;
    });
  };
  
  
  const addEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prevState => {
      const lastEvent = prevState.events[prevState.events.length - 1];
      if (!lastEvent || (lastEvent.eventName.trim() !== '' && lastEvent.eventDescription.trim() !== '')) {
        return {
          ...prevState,
          events: [...prevState.events, { eventName: '', eventDescription: '' }]
        };
      }
      return prevState;
    });
  };
  
  
  // Function to handle changes in input fields
 // Function to handle changes in input fields
// Function to handle changes in input fields
const handleChange = (e, nestedKey, parentKey, grandParentKey) => {
  if (grandParentKey !== undefined) {
    // Handle nested changes for specialOffers or events
    const updatedNestedData = [...formData[parentKey]];
    updatedNestedData[grandParentKey][nestedKey] = e.target.value;
    setFormData(prevState => ({ ...prevState, [parentKey]: updatedNestedData }));
  } else if (parentKey !== undefined) {
    // Handle nested changes, such as in the contactDetails or address object
    if (parentKey === "address") {
      // For address fields, create a new address object with the updated value
      const updatedAddress = {
        ...formData.contactDetails.address,
        [nestedKey]: e.target.value
      };
      // Update contactDetails with the new address object
      setFormData(prevState => ({
        ...prevState,
        contactDetails: {
          ...prevState.contactDetails,
          address: updatedAddress
        }
      }));
    } else {
      // For other nested fields, update the nested object directly
      const updatedNestedData = { ...formData[parentKey], [nestedKey]: e.target.value };
      setFormData(prevState => ({ ...prevState, [parentKey]: updatedNestedData }));
    }
  } else if (e.target.type === 'radio') {
    // Handle radio button changes
    setFormData({ ...formData, [e.target.name]: e.target.value === 'true' });
  } else {
    // Handle top-level state changes
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
};
// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage(''); // Clear previous error messages

  if (!formData.contactDetails.address.city.trim() && !formData.name.trim()) {
    setErrorMessage('Name and City fields must not be empty.');
    return;
  } else if (!formData.name.trim()) {
    setErrorMessage('Name field must not be empty.');
    return;
  } else if (!formData.contactDetails.address.city.trim()) {
    setErrorMessage('City field must not be empty.');
    return;
  }

  try {
    if (isLoaded) {
      const placeDetails = await fetchPlaceDetails(formData.name);
      console.log(placeDetails);

      // Check if the fetched business name contains the user entered name
      if (placeDetails && placeDetails.name.toLowerCase().includes(formData.name.toLowerCase())) {
        // Your existing code to handle successful API response
        // Format and update the formData with fetched place details
        const response = await fetch(`${BASE_URL}/business`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Business created successfully!');
          setFormData({
            name: '',
            type: '',
            openingHours: '',
            contactDetails: { phone: '', email: '', website: '', address: { street: '', city: '', state: '', zipCode: '', country: '' } },
            specialOffers: [],
            events: [],
            premium: true
          });
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'An error occurred while creating the business.');
        }
      } else {
        // Error handling if the business name does not match
        setErrorMessage(`No business found with the name '${formData.name}'. Please check the name and try again.`);
      }
    } else {
      setErrorMessage('Google Places API is not loaded.');
    }
  } catch (error) {
    console.error('Error creating business:', error);
    setErrorMessage(error.message || 'No business found that matches the entered name.');
  }
};





return (
  <Box component="form" onSubmit={handleSubmit} className="business-container" sx={{ mt: 1 }}>
    {errorMessage && (
      <div className="message-container ">
        <div className="message-content">{errorMessage}</div>
      </div>
    )}
    <h1 className="form-heading">Create a New Business</h1>
    <TextField
      className="form-field"
      margin="normal"
      
      fullWidth
      id="name"
      label="Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
    />
    <TextField
      className="form-field"
      margin="normal"
      fullWidth
      id="type"
      label="Type"
      name="type"
      value={formData.type}
      onChange={handleChange}
    />
     <TextField
      className="form-field"
      margin="normal"
      fullWidth
      id="city"
      label="City"
      name="city"
      value={formData.contactDetails.address.city}
      onChange={(e) => handleChange(e, 'city', 'address')}
    />
    <TextField
      className="form-field"
      margin="normal"
      fullWidth
      id="openingHours"
      label="Opening Hours"
      name="openingHours"
      value={formData.openingHours}
      onChange={handleChange}
    />
    <h2 className="section-heading">Contact Details</h2>
    <TextField
      className="form-field"
      margin="normal"
      fullWidth
      id="phone"
      label="Phone"
      name="phone"
      value={formData.contactDetails.phone}
      onChange={(e) => handleChange(e, 'phone', 'contactDetails')}
    />
    <TextField
      className="form-field"
      margin="normal"
      fullWidth
      id="email"
      label="Email"
      name="email"
      type="email"
      value={formData.contactDetails.email}
      onChange={(e) => handleChange(e, 'email', 'contactDetails')}
    />
    <TextField
      className="form-field"
      margin="normal"
      fullWidth
      id="website"
      label="Website"
      name="website"
      value={formData.contactDetails.website}
      onChange={(e) => handleChange(e, 'website', 'contactDetails')}
    />
  
   
    <h2 className="section-heading">Special Offers</h2>
    {formData.specialOffers.map((offer, index) => (
      <div key={index} className="offer-section">
        <TextField
          className="form-field"
          margin="normal"
          fullWidth
          label="Title"
          value={offer.title}
          onChange={(e) => handleChange(e, 'title', 'specialOffers', index)}
        />
        <TextField
          className="form-field"
          margin="normal"
          fullWidth
          label="Description"
          value={offer.description}
          onChange={(e) => handleChange(e, 'description', 'specialOffers', index)}
        />
      </div>
    ))}
    <Button
      className="secondary__btn" 
      onClick={addSpecialOffer} 
    >
      Add Special Offer
    </Button>
    <h2 className="section-heading">Events</h2>
    {formData.events.map((event, index) => (
      <div key={index} className="event-section">
        <TextField
          className="form-field"
          margin="normal"
          fullWidth
          label="Event Name"
          value={event.eventName}
          onChange={(e) => handleChange(e, 'eventName', 'events', index)}
        />
        <TextField
          className="form-field"
          margin="normal"
          fullWidth
          label="Event Description"
          value={event.eventDescription}
          onChange={(e) => handleChange(e, 'eventDescription', 'events', index)}
        />
      </div>
    ))}
    <Button
      className="secondary__btn"
    onClick={addEvent}
    >
      Add Event
    </Button>
    <Button
      className="primary__btn"
      type="submit"
      fullWidth
      variant="contained"
    >
      Create Business
    </Button>
  </Box>
);



}

export default Business;
