import React from 'react'
import PropTypes from 'prop-types'
import {Container,Row,Col} from 'react-bootstrap'
import './../styles.css'

import LoginForm from './BodyContent/LoginForm'



const Body = () => {
  return (
    <Container fluid className="body bg-light text-dark px-2 pt-1">
        
          {/* content */}
          <Row>
            <Col>
            </Col>
            <Col xl={4} lg={6} md={6} sm={8} xs={12}>
              <LoginForm/>
            </Col>
            <Col>
            </Col>
          </Row>




    </Container>
  )
}

Body.propTypes = {}

export default Body