import React from 'react'
import PropTypes from 'prop-types'

import {Container,Row,Col} from "react-bootstrap"
import LoginForm from './LoginForm'

const login_content = props => {
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

login_content.propTypes = {}

export default login_content