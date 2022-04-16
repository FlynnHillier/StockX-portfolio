import React,{useContext} from 'react'

import { useParams } from 'react-router-dom'

import PropTypes from 'prop-types'


import "./style.css"


import StockContext from '../../context/StockProvider'
import { Container,Card,Row,Col } from 'react-bootstrap'

import ItemPageStandard from '../../components/stock/ItemPageStandard'
import { ListGroup } from 'react-bootstrap'






















const AmmendItemPage = ({}) => {
   let {currentStock} = useContext(StockContext)

   const {itemID} = useParams()

   let currentItemData = currentStock.find((item) => item.urlKey === itemID)
    
   


  return (
    <ItemPageStandard
      itemTitle={currentItemData.title}
      itemColour={currentItemData.colour}
      itemImgURL={currentItemData.imgURL}
    >
      
      <Row>
          <Col xxl={10} xl={10}>
            <ListGroup
                className="list-group-flush"
            >
                
            </ListGroup>
          </Col>
          <Col>
                hi
          </Col>
      </Row>


      </ItemPageStandard>
  )
}

AmmendItemPage.propTypes = {}

export default AmmendItemPage