import React, {useContext} from 'react'
import AuthContext from '../../context/AuthProvider'

import "./StyleSheets/header.css"


import PropTypes from 'prop-types'
import {Container,Row,Col} from 'react-bootstrap'
import Title from './Title'
import NavBar from './NavBar'
import HeadNotes from './HeadNotes'


const Header = () => {
  
  const {email, auth_state} = useContext(AuthContext)

  
  const headNotes = auth_state ? [<a href='/logout'>logout</a>,email] : [<a href="/login">login</a>]



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
                active:false,
                urlPath:"/login",
                name:"po"
              },
              {
                active:false,
                urlPath:"/login",
                name:"login"
              },
              {
                active:false,
                urlPath:"/signup",
                name:"signup"
              },
              {
                active:true,
                urlPath:"/",
                name:"dashboard"
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