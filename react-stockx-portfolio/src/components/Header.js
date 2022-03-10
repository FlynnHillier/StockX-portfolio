import React from 'react'
import PropTypes from 'prop-types'
import {Container,Row,Col} from 'react-bootstrap'
import Title from './Title'
import NavBar from './NavBar'
import HeadNotes from './HeadNotes'


const Header = () => {
  return (
   <Container fluid className="bg-dark">
       
       <Row className='gx-0 px-3'>
          <Col xs={10}>
            <Title title="StockX portfolio App"></Title>
          </Col>
          <Col xs={2}>
              <HeadNotes elements={[
                  <a href="/login"> login </a>,
                  <p> username</p>
              ]}/>
          </Col>
       </Row>
       
        <Row className='gx-0'>
          <Col>
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
          </Col>
        </Row>
       
   </Container>
  )
}

Header.propTypes = {
   
}

export default Header