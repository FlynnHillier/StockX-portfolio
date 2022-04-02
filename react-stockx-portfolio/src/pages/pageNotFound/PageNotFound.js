import React from 'react'

import {Container,Row,Col} from "react-bootstrap"

import "./style.css"

const PageNotFound = () => {
  return (
    <Container className="pageNotFound">
        <Row>
            <Col>
            </Col>
            <Col xs={6}>
                <Container className="pageNotFound content">
                    <h1>
                        OOPS!
                    </h1>
                    <h3>
                        We couldnt find that page for you!
                    </h3>
                </Container>
            </Col>
            <Col>
            </Col>
        </Row>


    </Container>
  )
}

export default PageNotFound