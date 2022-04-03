import React from 'react'
import PropTypes from 'prop-types'

import { Container ,Col,Row} from 'react-bootstrap'


import ItemBar from '../../components/stock/ItemBar'


const CurrentStock = () => {
  return (
    <Container 
        fluid
    >

        <Row className="g-0">
            <Col xs={5}>
                <ItemBar 
                    props={{
                        title:"Dunk low helix stinks of shit",
                        imgUrl:"https://images.stockx.com/images/Nike-Dunk-Low-Fossil-Rose.jpg?fit=fill&bg=FFFFFF&w=480&h=320&fm=avif&auto=compress&q=90&dpr=1&trim=color&updated_at=1646932682",
                        qty:100
                    }}
                />
            </Col>
        </Row>

    </Container>
  )
}

CurrentStock.propTypes = {}

export default CurrentStock