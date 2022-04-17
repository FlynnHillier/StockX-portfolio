import React, { useState,useEffect } from 'react'
import PropTypes from 'prop-types'



import { useParams,useNavigate } from 'react-router-dom'

import { useContext } from 'react'
import StockContext from '../../context/StockProvider'



import { Row,Col,Container,Card,ListGroup,Badge,Button } from 'react-bootstrap'
import "./style.css"
import { ListGroupItem } from 'react-bootstrap'

import ItemPageStandard from '../../components/stock/ItemPageStandard'




const SizingSelector = ({sizingData,selectedSize,setSelectedSize}) => {

  return (
    <Container 
      fluid
    >

              <Row className="gx-2 gy-1">
                  {sizingData.map((size)=>{

                    let classes = "SizingSelector Size text-center"
                    if(size.size === selectedSize){
                      classes += " active"
                    }


                    return (
                      <Col xxl={3} xl={3} lg={3} md={4} xs={4}  key={size.size}>
                        <div
                          key={size.size}
                          className={classes}
                          onClick={()=>{
                            setSelectedSize(size.size)
                          }}
                        >
                          <h6 className='fw-bold'>{size.size}</h6>
                          <Badge bg="secondary" pill>
                                x{size.qty}
                          </Badge>
                        </div>
                      </Col>
                    )
                  })}
              </Row>

    </Container>


  )
}








const SingleSizeInfoDisplay = ({sizeData}) => {

  return (
    <Card
      border="light"
    >
      <Card.Header as="h5">
        {sizeData.size}
      </Card.Header>
      <Card.Body>
        <ListGroup
          className="list-group-flush mb-3"
        >
          <ListGroup.Item>
            <p1> <span className='fw-bold'> Ask </span> £{sizeData.lowestAsk} </p1> 
          </ListGroup.Item>
          <ListGroup.Item>
            <p1>   <span className='fw-bold'> Bid </span> £{sizeData.highestBid} </p1> 
          </ListGroup.Item>
          <ListGroup.Item>
            <p1>   <span className='fw-bold'> Last sale </span> £{sizeData.lastSale} </p1> 
          </ListGroup.Item>
        </ListGroup>

        <p1> You own <span className='fw-bold'>x{sizeData.qty}</span> of this size</p1>

        <div className='mt-3'>
          <ListGroup

            className="list-group-flush"
          >
            <ListGroup.Item>
            <p1> <span className='fw-bold'> Collective Ask </span> £{sizeData.lowestAsk * sizeData.qty} </p1> 
            </ListGroup.Item>
            <ListGroup.Item>
            <p1> <span className='fw-bold'> Collective Bid </span> £{sizeData.highestBid * sizeData.qty} </p1> 
            </ListGroup.Item>
            <ListGroup.Item>
            <p1> <span className='fw-bold'> Collective Last sale </span> £{sizeData.lastSale * sizeData.qty} </p1> 
            </ListGroup.Item>
            
          </ListGroup>
        </div>




      </Card.Body>



    </Card>
  )

}





const AmmendItemButton = ({}) => {

  let navigate = useNavigate()


  return (
    <Button
      variant="secondary"
      onClick={()=>{  
        navigate(`./ammend`)
      }}
    >
      Ammend item stock
    </Button>

  )


}





const ItemSummary = ({currentItemData}) => {



  let totalAskValue = 0
  let totalBidValue = 0
  let totalSaleValue = 0


  const itemSizes =  currentItemData.sizes


  for (let sizeObj of itemSizes){

    const sizeQty = sizeObj.qty

    totalAskValue += sizeObj.lowestAsk * sizeQty
    totalBidValue += sizeObj.highestBid * sizeQty
    totalSaleValue += sizeObj.lastSale * sizeQty
  }





  return (
    <Card
      border="secondary"
    >
      <Card.Header 
        as="h5"
      > 
        Item summary
      </Card.Header>

      <Card.Body>

        <Card
          border="light"
        >
          <Card.Title as="h6">
            Total value when sold at:
          </Card.Title>
          <Card.Body>
            <ListGroup
              className="list-group-flush"
            >
              <ListGroupItem>
                <p1 className="fw-bold">  Ask: £{totalAskValue}</p1>
              </ListGroupItem>
              <ListGroupItem>
                <p1 className="fw-bold">  Bid: £{totalBidValue}</p1>
              </ListGroupItem>
              <ListGroupItem>
              <p1 className="fw-bold">  Last Sale: £{totalSaleValue}</p1>
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
        </Card>
        <AmmendItemButton/>
      </Card.Body>

      </Card>
  )



}



















const CurrentStockViewItem = ({currentStock,itemID}) => {
  let [currentItemData,setCurrentItemData] = useState({})
  let [isLoading,setIsLoading] = useState(true)
  let [sizingData,setSizingData] = useState([])
  let [selectedSize,setSelectedSize] = useState(null)
  let [displaySizeElemenent,setDisplaySizeElement] = useState(<>Element not loaded yet.</>)

  


  function onLoad(){
    setSizingData(currentItemData.sizes)
    setSelectedSize(currentItemData.sizes[0].size)
  }


  function updateDisplayedSize(){
    let selectedSizeData = sizingData.find((sizeObj)=>sizeObj.size === selectedSize)
    setDisplaySizeElement(<SingleSizeInfoDisplay sizeData={selectedSizeData}/>)
  }


  useEffect(()=>{
    let itemData = currentStock.find((item) => item.urlKey === itemID)
    setCurrentItemData(itemData)
  },[])


  useEffect(()=>{
    setIsLoading(currentItemData === {})
  },[currentItemData])


  useEffect(()=>{

    if(isLoading === false){
      onLoad()
    }
  },[isLoading])


  useEffect(()=>{
    if(selectedSize !== null){
      updateDisplayedSize()
    }
  },[selectedSize])



  const FooterElem= () => {
      return (
        <Card
            border="light"
          >
            <Card.Header as="h4">
              Sizes
            </Card.Header>
            <Card.Body>
              <SizingSelector
                sizingData={currentItemData.sizes} 
                selectedSize={selectedSize} 
                setSelectedSize={setSelectedSize}
              />
            </Card.Body>
          </Card>
      )
  }







  return ( isLoading ? 
    <>Loading..</> 
    : 
    <ItemPageStandard
      itemTitle={currentItemData.title}
      itemColour={currentItemData.colour}
      itemImgURL={currentItemData.imgURL}
      ImageFooterElem={
        FooterElem
      }
    >
      
      <Row>
          <Col xxl={8} xl={7} lg={6} md={7}xs={12}>
            {displaySizeElemenent}
          </Col>
          <Col xxl={4} xl={5} lg={6} md={5} xs={12}>
                <ItemSummary
                  currentItemData={currentItemData}
                />
          </Col>
      </Row>


      </ItemPageStandard>
  )
}


const CurrentStockViewItemPage = ({}) => {
  let {currentStock,currentStockIsInitialised,currentStock_init} = useContext(StockContext)
  const {itemID} = useParams()

  useEffect(()=>{
    currentStock_init()
  },[])

  return currentStockIsInitialised ? 
  <CurrentStockViewItem
    currentStock={currentStock}
    itemID={itemID}  
  />
  :
  <>
    Loading current Stock context....
  </>

}




CurrentStockViewItemPage.propTypes = {}

export default CurrentStockViewItemPage