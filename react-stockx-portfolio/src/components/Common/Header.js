import React, {useContext} from 'react'
import AuthContext from '../../context/AuthProvider'

import "./StyleSheets/header.css"

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'
import {Container,Row,Col} from 'react-bootstrap'
import Title from './Title'
import NavBar from './NavBar'
import HeadNotes from './HeadNotes'


const Header = () => {
  
  const {email, auth_state} = useContext(AuthContext)

  
  const headNotes = auth_state ? [<Link to='/logout'>logout</Link>,email] : [<Link to="/login">login</Link>]



  return (
   <Container fluid className="header bg-dark">
       
       <Row className='gx-0 px-3'>
          <Col xs={10}>
            <Title title="Lokker"></Title>
          </Col>
          <Col xs={2}>
              <HeadNotes elements={headNotes}/>
          </Col>
       </Row>
       
        <Row className='gx-0'>
          <Col>
            <NavBar components ={
              [
              {
                urlPath:"/",
                name:"dashboard"
              },
              {
                urlPath:"/stock/current",
                name:"current stock"
              },
              {
                urlPath:"/settings",
                name:"settings"
              }
            ]
            }></NavBar>
          </Col>
        </Row>
       
   </Container>
  )
}

Header.propTypes = {
   
}

export default Header