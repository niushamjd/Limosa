import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert("Please check your email to reset your password.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="auth__container d-flex justify-content-between">
              <div className="auth__form">
                <h2>Reset Password</h2>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      id="email"
                      value={email}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button type="submit" className="btn secondary__btn auth__btn">
                    Submit
                  </Button>
                </Form>
                <p>
                  Remembered your password? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ForgotPassword;
