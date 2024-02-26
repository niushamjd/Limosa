import React, { useState } from "react";
import CommonSection from "./../shared/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { useLocation } from "react-router-dom";

import Newsletters from "./../shared/Newsletter";
const SearchResultList = () => {
  const location = useLocation();
  console.log(location);

  const [data] = useState(location.state);

  return (
    <>
      <CommonSection title={"Search Result"} />
      <section>
        <Container>
          <Row>
            
          </Row>
        </Container>
      </section>
      <Newsletters />
    </>
  );
};

export default SearchResultList;
