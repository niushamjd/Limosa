import React from 'react'
import './newsletter.css'
import { Container, Row, Col } from 'reactstrap'
import maleTourist from '../assets/images/male-tourist.png'
const Newsletter = () => {
  return(
   <section className='newsletter'>
    <Container>
        <Row>
            <Col lg='6'>
                <div className='newsletter__content'>
                    <h2>Subscribe to our newsletter</h2>
                    <div className='newsletter__input'>
                        <input type='text' placeholder='Enter your email ' />
                        <button className='btn newsletter__btn'>Subscribe</button>
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

export default Newsletter