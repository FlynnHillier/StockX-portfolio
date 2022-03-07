import 'bootstrap/dist/css/bootstrap.css'

import React from 'react'
import PropTypes from 'prop-types'

import { Container,Row,Col} from 'react-bootstrap'


const Title = ({title}) => {
  return (
      <Container 
        fluid 
        className="title_container bg-dark text-light" 
        // style={
        //   {
        //     height:(0.25)
        //   }
        // }
      >
          <Row 
            className="bg-dark h-100 g-0 align-items-center"
          >
            <Col 
              xs={12} 
              className="p-10"
            >

              <p className='title'
                // style={{
                //   fontSize:45
                // }}
              >
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