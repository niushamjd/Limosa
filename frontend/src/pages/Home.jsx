import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/hero-img01.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import Subtitle from "./../shared/Subtitle";
import worldImg from "../assets/images/world.png";

import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import MasonryImagesGallery from "../components/Images-gallery/MasonryImagesGallery";
import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../shared/Newsletter";
import ItineraryMap from "./ItineraryMap";
import {
  Button,
} from "@mui/material";

const Home = () => {
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"Tailor your trips!"} />
                  <img src={worldImg} alt=""></img>
                </div>
                <h1>
                  {" "}
                  Discover The Trip of Your Dreams with 
                  <span className="highlight"> Limosa </span>{" "}
                </h1>
                <p>
                Discover Limosa, your highly personalized travel itinerary planner. Limosa creates a travel experience uniquely tailored to your preferences using powerful AI technologies. Your plan will be based on many factors ranging from your travel interests to budget, duration, location, and those little details that truly matter to you. Traveling with friends or family? Limosa lets you connect your profile with your group, ensuring everyone's interests and needs are met in a shared travel plan. As a business, you can purchase extra credits on our website to get recommended more frequently. You can also provide in-depth venue details to reach more relevant customers and ultimately improve your ratings. </p>
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" controls />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5 ">
                <img src={heroImg02} alt="" />
              </div>
            </Col>
            <div className="left-aligned-button-container">
              <Link to="/new-itinerary">
                <Button
                  type="submit"
                  variant="contained"
                  className="btn primary__btn"
                  sx={{ mt: 2 }}
                >
                  Create my trip
                </Button>
              </Link>
            </div>
          </Row>
        </Container>
      </section>
      <ItineraryMap />
      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">What we serve</h5>
              <h2 className="services__title">We offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>
      <section>
        <Container>
        <Subtitle subtitle={"Experience"} />
          <Row className="d-flex justify-content-center align-items-center">
            <Col lg="6">
              <div>               
                <h2>
                  With our all experience we will serve you
                </h2>
                <p>
                  We are a team of professionals always ready to help you
                  with your travel needs. 
                  <br/>
                  We believe in creating memorable
                  travel.
                </p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>1k+</span>
                  <h6>Successfull Transfers</h6>
                </div>
                <div className="counter__box">
                  <span>500+</span>
                  <h6>Regular clients</h6>
                </div>
                <div className="counter__box">
                  <span>30</span>
                  <h6>Years experience</h6>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Visit our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Fans Love"} />
              <h2 className="testimonial__title">What our fans say about us </h2>
            </Col>
            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Home;
