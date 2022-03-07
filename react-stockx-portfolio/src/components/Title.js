import 'bootstrap/dist/css/bootstrap.css'

import React from 'react'
import PropTypes from 'prop-types'

import { Container,Row,Col} from 'react-bootstrap'


const Title = ({title}) => {
  return (
      <Container 
        fluid 
        className="title_container bg-dark" 
      >
          <Row 
            className="bg-dark h-100 g-0 align-items-center"
          >
            <Col 
              xs={12} 
              className="ps-3"
            >

              <p className='title'>
                {title}
              </p>

            </Col>

          </Row>
      </Container>

  )
}

Title.propTypes = {
  title:PropTypes.string.isRequired,
}

export default Title