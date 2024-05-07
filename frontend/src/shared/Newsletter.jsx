import React, { useState, useEffect } from 'react';
import './newsletter.css';
import { Container, Row, Col } from 'reactstrap';
import maleTourist from '../assets/images/male-tourist.png';
import { BASE_URL } from '../utils/config';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 1500);  // Clears the error message after 3 seconds
    }
    return () => clearTimeout(timer);  // Cleanup function to clear the timer
  }, [errorMessage]);  // This effect runs whenever errorMessage changes

  const handleSubscribe = async () => {
    if (!email) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setErrorMessage('Successfully subscribed to newsletter!');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Failed to subscribe to newsletter.');
      console.error('Error:', error);
    }
  };

  return (
    <section className='newsletter'>
      {errorMessage && (
        <div className="message-container">
          <div className="message-content">{errorMessage}</div>
        </div>
      )}
      <Container>
        <Row>
          <Col lg='6'>
            <div className='newsletter__content'>
              <h2>Subscribe to our newsletter</h2>
              <div className='newsletter__input'>
                <input 
                  type='text' 
                  placeholder='Enter your email' 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className='btn newsletter__btn' onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>
              <p>
                Subscribe to our newsletter to receive our latest news and updates. We do not spam.
              </p>
            </div>
          </Col>
          <Col lg='6'>
            <div className='newsletter__img'>
              <img src={maleTourist} alt='' />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Newsletter;
