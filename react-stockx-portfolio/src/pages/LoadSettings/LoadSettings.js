import React,{useContext, useEffect} from 'react'

import SettingsContext from '../../context/SettingsProvider'

import { Spinner,Container,Row,Col } from 'react-bootstrap'


const LoadSettingsPage = () => {

    let {settingsInit} = useContext(SettingsContext)

        useEffect(()=>{
            settingsInit()
        },[])

  return (
   <Container fluid>
     <Row>
       <Col xs={12}>
        <Row>
            <Col>
            </Col>
            <Col
              className="text-center"
            >
              <Spinner 
                animation="border"
              />
            </Col>
            <Col>
            </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <Row>
            <Col>
            </Col>
            <Col
              className="text-center"
            >
              Loading your settings....
            </Col>
            <Col>
            </Col>
        </Row>
      </Col>
     </Row>
   </Container>
  )
}

export default LoadSettingsPage