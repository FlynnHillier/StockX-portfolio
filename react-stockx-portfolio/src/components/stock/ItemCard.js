import React, { useEffect,useState } from 'react'
import PropTypes from 'prop-types'

import "./stylesheets/itemCard.css"

import urlPropType from 'url-prop-type';

import { Card,Table,Button,Row,Col,ButtonGroup} from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom';





const ItemCard = ({
    title,
    urlKey,
    qty,
    BidValue,
    AskValue,
    SaleValue,
    imgURL,

}) => {

    let navigate = useNavigate()

    const onViewMore = () => {
        let path = `view?item=${urlKey}`
        navigate(path)
    }



  return (
    <Card 
        className="itemCard"
        border=""
    >  
    <Card.Header as="h6">{title}</Card.Header>
    <Card.Img 
        variant="top" 
        src={imgURL}
        alt="item image"
    />  
    <Card.Body>
        <Card.Title>x{qty}</Card.Title>

        <Table 
                size='sm'
            >
                        <tbody>
                            <tr>
                                <th>Ask value</th>
                                <th>{AskValue}</th>
                            </tr>
                            <tr >
                                <th>Bid value </th>
                                <th>{BidValue}</th>
                            </tr>
                            <tr>
                                <th> Sale value</th>
                                <th>{SaleValue}</th>
                            </tr>
                        </tbody>

            </Table>


        <ButtonGroup
            className="d-flex"
        >
            <Button
                variant="dark" 
                onClick={onViewMore}
            >
                view more
            </Button>
        </ButtonGroup>

    </Card.Body>

    </Card>
  )
}

ItemCard.propTypes = {
    ItemData:PropTypes.shape(
        {
            urlKey:PropTypes.string.isRequired,
            colour:PropTypes.string.isRequired,
            title:PropTypes.string.isRequired,
            sizes:PropTypes.arrayOf(
                PropTypes.shape(
                    {
                        size:PropTypes.number.isRequired,
                        qty:PropTypes.number.isRequired
                    }
                )
            ).isRequired
        }
    )
}

export default ItemCard