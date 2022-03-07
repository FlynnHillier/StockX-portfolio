import React from 'react'
import PropTypes from 'prop-types'
import {Container} from 'react-bootstrap'
import './../styles.css'
import './StyleSheets/body.css'

const Body = () => {
  return (
    <Container fluid className="body bg-light text-dark px-2 pt-1">
        <p>body content</p>
    </Container>
  )
}

Body.propTypes = {}

export default Body