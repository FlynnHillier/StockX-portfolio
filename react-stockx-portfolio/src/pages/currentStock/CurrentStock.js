import React from 'react'
import PropTypes from 'prop-types'

import { Container ,Col,Row,CardGroup} from 'react-bootstrap'


import ItemCard from '../../components/stock/ItemCard'



const CurrentStock = () => {
  return (
    <Container 
        fluid
    >

        <Row>
            <Col xs={6} sm={4} md={4} lg={3} xl={2}>
                <ItemCard data={{
                    imgURL:"https://images.stockx.com/images/Nike-Dunk-Low-Fossil-Rose.jpg",
                    qty:5,
                    sizes:[1,2,3]
                }}/>
            </Col>
        </Row>
    

    </Container>
  )
}

CurrentStock.propTypes = {}

export default CurrentStock