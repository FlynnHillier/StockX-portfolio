import React from 'react'
import "./stylesheets/itembar.css"

import { Container,Row,Col,Image } from 'react-bootstrap'

import PropTypes from 'prop-types'
import urlPropType from 'url-prop-type'

const ItemBar = ({props,height,width}) => {
    return (
    <Container 
        sm
        className="itembar border border-secondary p-2" 
    >
        <Row className="g-3">
            <Col xs={4}>
                <Image thumbnail src={props.imgUrl}/>
            </Col>
            <Col xs={8}>
                <Row>
                    <Col xs={4}>
                        <h5>
                            {props.title}
                        </h5>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>
                        <p1>
                            {props.qty}
                        </p1>
                    </Col>
                </Row>
            </Col>
        </Row>

    </Container>
  )
}

ItemBar.propTypes = {
    title:PropTypes.string.isRequired,
    imgUrl:urlPropType.isRequired,
    sizes:PropTypes.arrayOf(PropTypes.number),
    qty:PropTypes.number
}

export default ItemBar