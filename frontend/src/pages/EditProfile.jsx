import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import { getNameList } from "country-list";
import "../styles/edit-profile.css";
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

function Message({ message, onClose }) {
  return (
    <div className="message-container">
      <div className="message-content">
        {message}
        
      </div>
    </div>
  );
}

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
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [role, setRole] = useState(user.role || ''); // Add this line

  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  
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
  const validateNameInput = (input) => {
    // Regex kullanarak harflere, Türkçe karakterlere, boşluklara ve sayılara izin ver
    const regex = /^[a-zA-ZğüşöçİĞÜŞÖÇ0-9\s]+$/;
    return regex.test(input);
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    if (validateNameInput(newName) || newName === "") {
      setName(newName);
      setNameError('');
    } else {
      setNameError('Invalid characters. Only letters, numbers, and spaces are allowed.');
    }
  };
  
  const handleSurnameChange = (e) => {
    const newSurname = e.target.value;
    if (validateNameInput(newSurname) || newSurname === "") {
      setSurname(newSurname);
      setSurnameError('');
    } else {
      setSurnameError('Invalid characters. Only letters, numbers, and spaces are allowed.');
    }
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
      role,
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
        setSuccessMessage("Profile is edited successfully");
        setShowMessage(true);
        window.scrollTo(0, 0);
        dispatch({ payload: response.data });
      } else {
        console.error('Failed to update user information');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
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
      setRole(user.role || ''); // Add this line
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [showMessage]);

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
    <>
    {showMessage && <Message message={successMessage} onClose={handleCloseMessage} />}
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
      <TextField
  label="Name"
  value={name}
  onChange={handleNameChange}
  fullWidth
  margin="normal"
  color="warning"
  error={!!nameError}
  helperText={nameError}
/>
<TextField
  label="Surname"
  value={surname}
  onChange={handleSurnameChange}
  fullWidth
  margin="normal"
  color="warning"
  error={!!surnameError}
  helperText={surnameError}
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
        <FormControl fullWidth margin="normal" color="warning">
          <InputLabel>Role</InputLabel>
          <Select    
           label="Role"        
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="traveler">traveler</MenuItem>
            <MenuItem value="business">business</MenuItem>
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
  </>
  );
}

export default EditProfile;
