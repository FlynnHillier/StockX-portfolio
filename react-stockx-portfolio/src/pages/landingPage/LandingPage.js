import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'

import "./style.css"


const LandingPage = () => {
  return (
   <Container fluid className="landingPage">
     <Row>
        <Col>
        </Col>
      <Col xs={6} className="text-center">
        <h1>
          Welcome to Lokker!
        </h1>
      </Col>
      <Col>
      </Col>
     </Row>
   </Container>
  )
}

export default LandingPage