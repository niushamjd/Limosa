/*
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../styles/profile.css';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from "../utils/config";

const EditProfile = () => {
  // State variables for form fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const { user, dispatch } = useContext(AuthContext);
// Function to format date as "yyyy-MM-dd"
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Add leading zero if month/day is less than 10
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the form data
    const formData = {
      name,
      surname,
      username,
      dateOfBirth,
      occupation,
      city,
      country
    };

    try {
      // Make a PUT request to update user information
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle the response
      if (response.ok) {
        console.log('User information updated successfully');
        dispatch({ payload: response.data });
      } else {
        console.error('Failed to update user information');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Effect to set the form fields with user's information when the component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSurname(user.surname || '');
      setUsername(user.username || '');
      setDateOfBirth(formatDate(user.dateOfBirth) || '');
      setOccupation(user.occupation || '');
      setCity(user.city || '');
      setCountry(user.country || '');
    }
  }, [user]);

  return (
    <section className="edit-profile">
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <h1 className="mb-4 fw-semibold">Edit Profile</h1>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="surname">Surname</Label>
                <Input type="text" name="surname" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="dateOfBirth">Date of Birth</Label>
                <Input type="date" name="dateOfBirth" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="occupation">Occupation</Label>
                <Input type="text" name="occupation" id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="city">City</Label>
                <Input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="country">Country</Label>
                <Input type="text" name="country" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </FormGroup>
              <Button className="btn primary__btn mr-3" type="submit">Update Edited Information</Button>
              <Button className="btn secondary__btn"><Link to="/forgot-password">Reset Password</Link></Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default EditProfile;

*/

import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import { getNameList } from "country-list";
import { State } from "country-state-city";
import {
  FormControl,
  InputLabel,
  Select,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

function EditProfile() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [occupation, setOccupation] = useState("");
  const [city, setCity] = useState("");
  const { user, dispatch } = useContext(AuthContext);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState("");

  // getNameList'den dönen nesneyi al
  const countriesObject = getNameList();

  // Nesnenin anahtarlarını (ülke isimlerini) bir diziye çevir
  const countryNames = Object.keys(countriesObject);
  //const countryCodes = Object.values(countriesObject);
  //console.log(State.getAllStates())

  const occupations = [
    "Engineer",
    "Student",
    "Businessman/Businesswoman",
    "Healthcare Professional",
    "Artist",
    "Educator",
    "Retiree",
    "IT Professional",
    "Chef/Culinary Enthusiast",
    "Environmental Scientist",
  ];


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the form data
    const formData = {
      name,
      surname,
      username,
      dateOfBirth,
      occupation,
      city,
      country
    };

    try {
      // Make a PUT request to update user information
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle the response
      if (response.ok) {
        console.log('User information updated successfully');
        dispatch({ payload: response.data });
      } else {
        console.error('Failed to update user information');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Effect to set the form fields with user's information when the component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSurname(user.surname || '');
      setUsername(user.username || '');
      setDateOfBirth(user.dateOfBirth || '');
      setOccupation(user.occupation || '');
      setCity(user.city || '');
      setCountry(user.country || '');
    }
  }, [user]);

  /*
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      userId: user.id,
      name,
      surname,
      username,
      dateOfBirth,
      occupation,
      city,
      country,
    };

    fetch(`${BASE_URL}/edit-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
*/
  // Ülke seçimi değiştiğinde çalışacak fonksiyon
  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    setCountry(selectedCountryName);

    // Seçilen ülkenin kodunu bul
    const selectedCountryCode = countriesObject[selectedCountryName];
    setCountryCode(selectedCountryCode); // Ülke kodunu state'e kaydet

    // Seçilen ülkeye ait şehirleri bul
    const citiesOfSelectedCountry =
      State.getStatesOfCountry(selectedCountryCode);
    setCities(citiesOfSelectedCountry); // Şehir listesini state'e kaydet
  };

  // Şehir seçimi değiştiğinde çalışacak fonksiyon
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          color="warning"
        />
        <TextField
          label="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          fullWidth
          margin="normal"
          color="warning"
        />
        <TextField
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          fullWidth
          margin="normal"
          color="warning"
          // Material-UI uses the InputLabelProps prop to control the label behavior
          InputLabelProps={{
            // This ensures the label doesn't overlap with the selected date
            shrink: true,
          }}
          inputProps={{
            max: today, // Restrict future dates
          }}
        />
        <FormControl fullWidth margin="normal" color="warning">
          <InputLabel>Occupation</InputLabel>
          <Select
            label="Occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          >
            {occupations.map((occupationOption, index) => (
              <MenuItem key={index} value={occupationOption}>
                {occupationOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ minWidth: 120 }}>
          <TextField
            //label="Country"
            value={country}
            onChange={handleCountryChange}
            select
            fullWidth
            margin="normal"
            color="warning"
            SelectProps={{ native: true }}
          >
            {countryNames.map((countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}{" "}
              </option>
            ))}
          </TextField>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <TextField
            label="City"
            value={city}
            onChange={handleCityChange}
            select
            fullWidth
            margin="normal"
            color="warning"
            SelectProps={{ native: true }}
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </TextField>
        </Box>
        <div style={{ display: "flex", justifyContent: "center" }}>
        <Button className="btn primary__btn mr-3" type="submit">
          Update Edited Information
        </Button>
        <Button className="btn secondary__btn">
          <Link to="/forgot-password">Reset Password</Link>
        </Button>
        </div>
      </form>
    </div>
  );
}
export default EditProfile;
