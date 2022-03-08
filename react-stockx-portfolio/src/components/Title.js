import 'bootstrap/dist/css/bootstrap.css'

import React from 'react'
import PropTypes from 'prop-types'

import { Container,Row,Col} from 'react-bootstrap'


const Title = ({title}) => {
  return (
      <Container 
        fluid 
        className="title_container overflow-hidden" 
      >


              <p className='title'>
                {title}
              </p>

      </Container>

  )
}

Title.propTypes = {
  title:PropTypes.string.isRequired,
}

export default Title