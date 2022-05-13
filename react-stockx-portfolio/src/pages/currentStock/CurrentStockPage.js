import React,{useEffect,useContext,useState} from 'react'
import PropTypes from 'prop-types'

import { Container ,Col,Row,CardGroup,Button} from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

import ItemCard from '../../components/stock/ItemCard'


import StockContext from '../../context/StockProvider'


const CurrentStockPage = () => {

    let {currentStock} = useContext(StockContext)
    const navigate = useNavigate()
  return (
    <Container 
        fluid
    >
        <Row>
            <Col xs={12}>
                <Button
                    onClick={()=>{
                        navigate("ammend")
                    }}
                >
                    Add a new item
                </Button>
            </Col>
            <Col xs={12}>
                <Row>
                    {
                        currentStock.map((item)=>{ 
                            
                            let totalAskValue = 0
                            let totalBidValue = 0
                            let totalSaleValue = 0

                            for(let sizeObj of item.sizes){
                                totalAskValue += (sizeObj.lowestAsk * sizeObj.qty)
                                totalBidValue += (sizeObj.highestBid * sizeObj.qty)
                                totalSaleValue += (sizeObj.lastSale * sizeObj.qty)
                            }
                            

                            return (
                            
                                <Col xs={6} sm={4} md={4} lg={3} xl={2} key={item.urlKey}>
                                    <ItemCard
                                        urlKey={item.urlKey}
                                        imgURL={item.imgURL}
                                        qty={item.qty}
                                        title={item.title}
                                        AskValue={totalAskValue}
                                        BidValue={totalBidValue}
                                        SaleValue={totalSaleValue}
                                    />

                                </Col>
                            )

                        }) 
                    }
                </Row>
            </Col>
        </Row>
    </Container>
  )
}

CurrentStockPage.propTypes = {}

export default CurrentStockPage