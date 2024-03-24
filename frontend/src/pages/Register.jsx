import React, { useState, useContext, useEffect } from "react";
import "../styles/login.css";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link,useNavigate } from "react-router-dom";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";

import { AuthContext } from "./../context/AuthContext";
import { BASE_URL } from "../utils/config";


const Register = () => {
  const [credentials, setCredentials] = useState({
    userName: undefined,
    email: undefined,
    password: undefined,
  });
  const [validationMessage, setValidationMessage] = useState(""); // State for the validation message
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  let timerId;
  useEffect(() => {
    // Cleanup function to clear the timeout when the component unmounts
    
    return () => clearTimeout(timerId);
  }, []);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };
 

  const handleClick = async (e) => {
    e.preventDefault();
// Check if the password is valid
if (!validatePassword(credentials.password)) {
  setValidationMessage("Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.");

  // Clear the message after 3 seconds
  timerId = setTimeout(() => {
    setValidationMessage("");
  }, 3000);

  return; // Prevent form submission if validation fails
}

setValidationMessage(""); // Clear validation message on successful validation


    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await res.json();

      if (!res.ok) alert(result.message);

      dispatch({ type: "REGISTER_SUCCESS" });
      navigate("/login")
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section>
      <Container>
         {/* Display validation message */}
         {validationMessage && (
          <div className="message-container">
            <div className="message-content">
              {validationMessage}
            </div>
          </div>
        )}
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="login" />
              </div>
              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="user" />
                </div>
                <h2>Register</h2>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      id="username"
                      onChange={handleChange}
                    />
                  </FormGroup>
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
                    Create Account
                  </Button>
                </Form>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
