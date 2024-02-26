import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/profile.css";
import SearchBar from "../shared/SearchBar";
import Newsletter from "../shared/Newsletter";
import ItineraryCard from "../shared/ItineraryCard";
import { Container, Row, Col } from "reactstrap";

import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";

const Itineraries = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const {
    data: itineraries,
    loading,
    error,
  } = useFetch(`${BASE_URL}/itineraries?page=${page}`);
  const { data: itineraryCount } = useFetch(`${BASE_URL}/itineraries/search/getItineraryCount`);

  useEffect(() => {
    const pages = Math.ceil(itineraryCount / 8);
    setPageCount(pages);
    window.scrollTo(0, 0);
  }, [page, itineraryCount, itineraries]);

  return (
    <>
      <CommonSection title={"All Itineraries"} />
      <section className="itineraries__section">
        <Container>
          <Row>
            {/* You can add a search bar here if needed */}
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          {loading && <h4 className="text-center pt-5">Loading...</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              {itineraries?.map((itinerary) => (
                <Col lg="3" md='6' sm='6' className="mb-4" key={itinerary._id}>
                  <ItineraryCard itinerary={itinerary} />
                </Col>
              ))}
              <Col lg="12">
                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                  {[...Array(pageCount).keys()].map((number) => (
                    <span
                      key={number}
                      onClick={() => setPage(number)}
                      className={page === number ? "active__page" : ""}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Itineraries;
