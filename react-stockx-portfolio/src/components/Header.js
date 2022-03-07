import React from 'react'
import PropTypes from 'prop-types'
import {Container} from 'react-bootstrap'
import Title from './Title'
import NavBar from './NavBar'

const Header = () => {
  return (
   <Container fluid>
       <Title title="StockX portfolio App"></Title>
       <NavBar components ={
          [
          {
            active:false,
            url:"/login",
            name:"login"
          },
          {
            active:false,
            url:"/signup",
            name:"signup"
          },
          {
            active:true,
            url:"/",
            name:"dashboard"
          }
        ]
        }></NavBar>
   </Container>
  )
}

Header.propTypes = {
   
}

export default Header