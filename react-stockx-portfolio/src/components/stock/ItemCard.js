import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import urlPropType from 'url-prop-type';


import { useState } from 'react'

import { Card,Table,Button,Row,Col } from 'react-bootstrap'









const ItemCard = ({data}) => {

  return (
    <Card 
        border=""
    >  


    <Card.Header as="h6"> Dunk low fossil</Card.Header>
    <Card.Img 
        variant="top" 
        src={data.imgURL}
        alt={"item"}
    />  
    <Card.Body>
        <Table hover >
            <tbody>
                <tr>
                    <th>Qty</th>
                    <th>{data.qty}</th>
                </tr>
                <tr>
                    <th>Total value</th>
                    <th>100</th>
                </tr>
            </tbody>
        </Table>

        <Row>
            <Col xs={4}>
                <Button variant="secondary">
                    Edit
                </Button>   
            </Col>
        </Row>

    </Card.Body>

    </Card>
  )
}

ItemCard.propTypes = {
    data:PropTypes.shape(
        {
            imgURL:urlPropType.isRequired,
            qty:PropTypes.number.isRequired,
            sizes:PropTypes.arrayOf(PropTypes.number)
        }
    )
}

export default ItemCard