import React from 'react'
import PropTypes from 'prop-types'

import { Container,Row,Col,Card } from 'react-bootstrap'


const ItemPageStandard = ({
  itemTitle,
  itemImgURL,
  itemColour,
  ImageFooterElem,
  children
}) => {

  return (
    <Container 
        fluid
      >

          <Card
            border="light"
          >
            <Card.Body>
                <Card.Title as="h3">
                  {itemTitle}
                </Card.Title>
                <Card.Subtitle as="h4" className="text-muted">
                  {itemColour}
                </Card.Subtitle>


                <Row className="g-4"> 

                  <Col xxl={4} lg={5} xs={12}>
                    <Card.Img
                      fluid
                      src={itemImgURL}
                    />
                    {
                      <ImageFooterElem/>
                    }
                  </Col>
                    <Col
                      border="light"
                    >
                        {children}
                    </Col>
                  </Row>


            </Card.Body>
          </Card>
       
      </Container>
  )
}

ItemPageStandard.propTypes = {
  itemTitle:PropTypes.string.isRequired,
  itemColour:PropTypes.string.isRequired,
  itemImgURL:PropTypes.string.isRequired,
  ImageFooterElem:PropTypes.func,
}

ItemPageStandard.defaultProps = {
  ImageFooterElem:()=>{
    return (
      <></>
    )
  }
}

export default ItemPageStandard