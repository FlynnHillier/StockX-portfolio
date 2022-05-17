import React,{useContext, useEffect} from 'react'

import StockContext from '../../context/StockProvider'

import { Spinner,Container,Row,Col } from 'react-bootstrap'


const LoadCurrentStockPage = () => {

    let {currentStock_init,errorMessage} = useContext(StockContext)

    useEffect(()=>{
        currentStock_init()
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
              Loading your items....
              <br/>
              <span className="text-danger">{errorMessage}</span>
            </Col>
            <Col>
            </Col>
        </Row>
      </Col>
     </Row>
   </Container>
  )
}

export default LoadCurrentStockPage