import React, { useState, useContext, useEffect } from "react";
import "../styles/login.css";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/images/login.png";
import userIcon from "../assets/images/user.png";
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from "./../context/AuthContext";
import { BASE_URL } from "../utils/config";

import { jwtDecode } from 'jwt-decode';
 // Import jwt-decode to decode the JWT
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });
  const [lockoutInfo, setLockoutInfo] = useState({
    isLocked: false,
    unlockTime: null,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000); // Clears the errorMessage after 2 seconds
    }
    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [errorMessage]); 
  
  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "post",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const result = await res.json();

      if (!res.ok) {
        if (res.status === 403) { // Assuming 403 status code for account lock
          setLockoutInfo({
            isLocked: true,
            unlockTime: result.unlockTime, // Adjust based on your backend response
          });
        }
        setErrorMessage(result.message);
      } else {
        dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Failed to connect. Please try again later.");
    }
  };

  const handleGoogleSuccess = async (res) => {
    console.log("Login Success", res); // Log the credential response
  
    const { credential } = res; // Extract the credential from the response
    const decodedToken = jwtDecode(credential); // Decode the JWT to check the content on the client-side
    console.log("Decoded JWT:", decodedToken);

    sendTokenToBackend(credential); // Send the JWT token to the backend
};

const sendTokenToBackend = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/google-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token }) // Send the JWT token to the backend
        });
        const text = await response.text();  // Get the raw response text
        try {
          const data = JSON.parse(text);  // Try to parse it as JSON
          if (response.ok) {
            dispatch({ type: "LOGIN_SUCCESS", payload: data });
              console.log("Authentication successful", data);
              navigate("/");
          } else {
              console.error("Failed to authenticate:", data.message);
          }
      } catch (e) {
          console.error("Failed to parse JSON!", text);
      }
  } catch (error) {
      console.error("Error connecting to the backend:", error);
  }
};
  const handleGoogleFailure = (res) => {
    console.error("Login Failed", res); // Log the error
  }

  
  

  return (
    <section>
      <Container>
        {/* Error Message Display */}
{errorMessage && (
  <div className="message-container error">
    <div className="message-content">{errorMessage}</div>
  </div>
)}
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="login" />
              </div>
              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="user" />
                </div>
                <h2>Login</h2>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      id="email"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Password"
                      id="password"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button
                    type="submit"
                    className="btn secondary__btn auth__btn"
                  >
                    Login
                  </Button>
                </Form>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
                <p>
                  Don't have an account? <Link to="/register">Create</Link>
                </p>
                <p>
                  Forgot your password?{" "}
                  <Link to="/forgot-password">Reset here</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
