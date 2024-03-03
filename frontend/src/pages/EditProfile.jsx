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
        dispatch({ type: "UPDATE_SUCCESS", payload: response.data });
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
              <Button className="btn secondary__btn"><Link to="/reset-password">Reset Password</Link></Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default EditProfile;
