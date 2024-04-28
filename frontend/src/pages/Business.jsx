import React, { useState } from 'react';
import { TextField, Button, Box, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { BASE_URL } from "../utils/config";

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
    premium: false // Default premium value
  });

  // Function to handle changes in input fields
 // Function to handle changes in input fields
// Function to handle changes in input fields
const handleChange = (e, nestedKey, parentKey, grandParentKey) => {
  if (grandParentKey !== undefined) {
    // Handle nested changes for specialOffers or events
    const updatedNestedData = [...formData[parentKey]];
    updatedNestedData[grandParentKey][nestedKey] = e.target.value;
    setFormData({ ...formData, [parentKey]: updatedNestedData });
  } else if (parentKey !== undefined) {
    // Handle nested changes, such as in the contactDetails or address object
    const updatedNestedData = { ...formData[parentKey], [nestedKey]: e.target.value };
    setFormData({ ...formData, [parentKey]: updatedNestedData });
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
  try {
    const response = await fetch(`${BASE_URL}/business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const responseData = await response.json();
      alert('Business created successfully!');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message); // Throw the specific error message returned by the server
    }
  } catch (error) {
    console.error('Error creating business:', error);
    alert(error.message);
  }
};


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <h1>Create a New Business</h1>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="type"
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="openingHours"
        label="Opening Hours"
        name="openingHours"
        value={formData.openingHours}
        onChange={handleChange}
      />
      <h2>Contact Details</h2>
      <TextField
        margin="normal"
        fullWidth
        id="phone"
        label="Phone"
        name="phone"
        value={formData.contactDetails.phone}
        onChange={(e) => handleChange(e, 'phone', 'contactDetails')}
      />
      <TextField
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
        margin="normal"
        fullWidth
        id="website"
        label="Website"
        name="website"
        value={formData.contactDetails.website}
        onChange={(e) => handleChange(e, 'website', 'contactDetails')}
      />
      <h3>Address</h3>
      <TextField
        margin="normal"
        fullWidth
        id="street"
        label="Street"
        name="street"
        value={formData.contactDetails.address.street}
        onChange={(e) => handleChange(e, 'street', 'address')}
      />
      <TextField
        margin="normal"
        fullWidth
        id="city"
        label="City"
        name="city"
        value={formData.contactDetails.address.city}
        onChange={(e) => handleChange(e, 'city', 'address')}
      />
      <TextField
        margin="normal"
        fullWidth
        id="state"
        label="State"
        name="state"
        value={formData.contactDetails.address.state}
        onChange={(e) => handleChange(e, 'state', 'address')}
      />
      <TextField
        margin="normal"
        fullWidth
        id="zipCode"
        label="Zip Code"
        name="zipCode"
        value={formData.contactDetails.address.zipCode}
        onChange={(e) => handleChange(e, 'zipCode', 'address')}
      />
      <TextField
        margin="normal"
        fullWidth
        id="country"
        label="Country"
        name="country"
        value={formData.contactDetails.address.country}
        onChange={(e) => handleChange(e, 'country', 'address')}
      />
      {/* Premium Radio Button */}
      <RadioGroup
        aria-label="premium"
        name="premium"
        value={formData.premium.toString()} // Convert boolean to string
        onChange={handleChange}
      >
        <FormControlLabel value="true" control={<Radio />} label="Premium" />
        <FormControlLabel value="false" control={<Radio />} label="Regular" />
      </RadioGroup>
      {/* Special Offers */}
      <h2>Special Offers</h2>
      {formData.specialOffers.map((offer, index) => (
        <div key={index}>
          <TextField
            margin="normal"
            fullWidth
            label="Title"
            value={offer.title}
            onChange={(e) => handleChange(e, 'title', 'specialOffers', index)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            value={offer.description}
            onChange={(e) => handleChange(e, 'description', 'specialOffers', index)}
          />
          {/* Add more fields for start and end dates */}
        </div>
      ))}
      <Button
        onClick={() => setFormData({ ...formData, specialOffers: [...formData.specialOffers, {}] })}
      >
        Add Special Offer
      </Button>
      {/* Events */}
      <h2>Events</h2>
      {formData.events.map((event, index) => (
        <div key={index}>
          <TextField
            margin="normal"
            fullWidth
            label="Event Name"
            value={event.eventName}
            onChange={(e) => handleChange(e, 'eventName', 'events', index)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Event Description"
            value={event.eventDescription}
            onChange={(e) => handleChange(e, 'eventDescription', 'events', index)}
          />
          {/* Add more fields for event date */}
        </div>
      ))}
      <Button
        onClick={() => setFormData({ ...formData, events: [...formData.events, {}] })}
      >
        Add Event
      </Button>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Create Business
      </Button>
    </Box>
  );
}

export default Business;
