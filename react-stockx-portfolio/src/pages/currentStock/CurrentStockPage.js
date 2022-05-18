import React,{useEffect,useContext,useState, Children} from 'react'
import PropTypes from 'prop-types'

import { Container ,Col,Row,CardGroup,Button,Card, ListGroup, ButtonGroup} from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

import ItemCard from '../../components/stock/ItemCard'


import StockContext from '../../context/StockProvider'
import SettingsContext from '../../context/SettingsProvider'




const StatTotalsTable = ({totalAsk,totalBid,totalSale}) => {
    return (
        <ListGroup className="border-0" variant="flush">
                <ListGroup.Item>
                    <span className="fw-bold">Ask : </span>£{totalAsk}
                </ListGroup.Item>
                <ListGroup.Item>
                    <span className="fw-bold">Bid : </span>£{totalBid}
                </ListGroup.Item>
                <ListGroup.Item>
                    <span className="fw-bold">Sale : </span>£{totalSale}
                </ListGroup.Item>
        </ListGroup>
    )
}

const StatTotalsView = ({totalValData,isItems,children}) => {
    return ( 
        <Container fluid className="mb-3">
            <Card className="w-100 text-center">
                <Card.Title as={"h3"}>
                    Summary
                </Card.Title>
                <Card.Body>
                    <Row>
                        <Col>
                        </Col>
                        <Col xs={8} md={6} xl={3}>
                            {
                                isItems ? 
                                <StatTotalsTable
                                    totalAsk={Math.round(totalValData.ask * 100) /100}
                                    totalBid={Math.round(totalValData.bid * 100) /100}
                                    totalSale={Math.round(totalValData.sale * 100) /100}
                                /> 
                                : 
                                <span className="text-muted"> you dont own anything. Try adding something!</span>
                            }
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                <Row>
                        <Col>
                        </Col>
                        <Col xs={8} md={6} xl={3}>
                            {children}
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Container>
    )
}





const CurrentStockPage = () => {

    let {currentStock} = useContext(StockContext)
    const navigate = useNavigate()
    const {settings} = useContext(SettingsContext)

    const feeMultiplier = (1-((settings.fee)/100))

    if(feeMultiplier === undefined){
        throw Error("fee is undefined.")
    }

    let totalVal = {
        ask:0,
        bid:0,
        sale:0
    }

    for(let item of currentStock){

        for(let sizeObj of item.sizes){
            totalVal.ask += (sizeObj.lowestAsk * sizeObj.qty * feeMultiplier)
            totalVal.bid += (sizeObj.highestBid * sizeObj.qty * feeMultiplier)
            totalVal.sale += (sizeObj.lastSale * sizeObj.qty *feeMultiplier)     
        }

    }



  return (
    <Container 
        fluid
    >
        <Row>
            <Col xs={12}>
                <StatTotalsView
                    totalValData={totalVal}
                    isItems={currentStock.length !== 0}
                >
                    <ButtonGroup className="d-flex">
                        <Button
                            variant={"success"}
                            onClick={()=>{
                                navigate("ammend")
                            }}
                        >
                            add an item
                        </Button>
                    </ButtonGroup>
                </StatTotalsView>
            </Col>
            <Col xs={12}>
                <Row>
                    {
                        currentStock.map((item)=>{ 
                            
                            let totalAskValue = 0
                            let totalBidValue = 0
                            let totalSaleValue = 0

                            for(let sizeObj of item.sizes){
                                totalAskValue += (sizeObj.lowestAsk * sizeObj.qty * feeMultiplier)
                                totalBidValue += (sizeObj.highestBid * sizeObj.qty  * feeMultiplier)
                                totalSaleValue += (sizeObj.lastSale * sizeObj.qty  * feeMultiplier)
                            }
                            

                            return (
                            
                                <Col xs={6} sm={4} md={4} lg={3} xl={2} key={item.urlKey}>
                                    <ItemCard
                                        urlKey={item.urlKey}
                                        imgURL={item.imgURL}
                                        qty={item.qty}
                                        title={item.title}
                                        AskValue={Math.round(totalAskValue * 100) / 100}
                                        BidValue={Math.round(totalBidValue * 100) / 100}
                                        SaleValue={Math.round(totalSaleValue * 100) / 100}
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