import React,{useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { ArrowRight } from 'react-bootstrap-icons'

import { Row,Col, ButtonGroup,Button,Container,Card,ListGroup,Badge } from 'react-bootstrap'
import ItemPageStandard from '../../components/stock/ItemPageStandard'



const QtyChangeBadge = ({qtychange,fontSize}) => {
    let bgColor
    let displayedQtyChange
  
  
    if(qtychange == 0){
      bgColor = "secondary"
      displayedQtyChange = 0
    }
    if(qtychange > 0){
      bgColor = "success"
      displayedQtyChange = qtychange
    }
    if(qtychange < 0){
      displayedQtyChange = String(qtychange).substring(1)
      bgColor = "danger"
    }
  
    return (
      <Badge
          className={`p-1 bg-${bgColor}`}
        >
          <span
            className={`fs-${fontSize}`}
          >
             {displayedQtyChange}x
          </span>
      </Badge>
    )
  }
  



const SizingSelector = ({sizingData,selectedSize,setSelectedSize}) => {
    return (
      <Container fluid>
                <Row className="gx-2 gy-1">
                    {sizingData.map((size)=>{
                        let classes = "SizingSelector Size text-center"
                        if(size.size === selectedSize){
                            classes += " active"
                        }

                        return (
                            <Col lg={4} xs={4}  key={size.size}>
                                <div
                                    key={size.size}
                                    className={classes}
                                    onClick={()=>{
                                    setSelectedSize(size.size)
                                    }}
                                >
                                    <h6 className='fw-bold'>{size.size}</h6>
                                </div>
                            </Col>
                        )
                    })}
                </Row>
      </Container>
    )
  }



  const AddNewSizeButton = ({}) => {

    return (
        <ButtonGroup className="d-flex">
            <Button
                variant="success"
                onClick={()=>{
                    
                }}
            >
                add another size.
            </Button>
        </ButtonGroup>
    )

  }

  const ChangesDisplay = ({
      unsavedChanges,
      setUnsavedChanges
  }) => {


    function removeChange(size){
        setUnsavedChanges((prevState)=>{
            let detached_prevState = JSON.parse(JSON.stringify(prevState))
            const indexOfTargetSize = detached_prevState.indexOf(detached_prevState.find((change) => change.size === size))
            if(indexOfTargetSize === -1){
                throw Error("could not remove change, as size selected for removal did not exist within changes array")
            }
            detached_prevState.splice(indexOfTargetSize,1)
            return detached_prevState
        })
    }
    return (
        <Card>
            <Card.Header as={"h4"}>
            Unsaved changes
            </Card.Header>
            <Card.Body>
            
            {
                unsavedChanges.length === 0 ?
                <p className="text-muted">
                no changes yet....
                </p>
                :
                <ListGroup
                className="list-group-flush"
                >
                    {
                    unsavedChanges.map((unsavedChange)=>{
                        return (
                        <ListGroup.Item
                            key={"qtyChange," + unsavedChange.size}
                            className={`bg-light py-1 pb-0 d-flex justify-content-center`}
                        >
                                <>
                                <span
                                    className='fw-bold fs-5 mx-2'
                                >
                                    {unsavedChange.size}
                                </span>
                                </>
                                {
                                unsavedChange.newFinalQty === 0 ? 
                                <Badge className="bg-danger py-1">
                                    REMOVING
                                </Badge> 
                                : 
                                <QtyChangeBadge
                                    qtychange={unsavedChange.qtyChange}
                                    fontSize={6}
                                />
                                }
                                <Badge 
                                className="bg-light text-secondary mx-2 py-2"
                                onClick={()=>{
                                    removeChange(unsavedChange.size)
                                }}
                                >
                                    revert
                                </Badge>
                        </ListGroup.Item>
                        )

                    })
                    }
                </ListGroup>
            }
            </Card.Body>

            {
            unsavedChanges.length !== 0 ?
            <Card.Footer>
            <ButtonGroup
                className="d-flex"
            >
                <Button
                variant='success'
                >
                save changes
                </Button>

            </ButtonGroup>

            </Card.Footer>
            :
            <>
            </>
            }
      </Card>
    )
  }


  const ChangeStager = ({
      initialQty,
      stagedQty,
      incQty,
      decQty,
  }) =>{


    return (
        <Card
                border="light"
              >
                <Card.Body
                  className="text-center"
                >

                  <Card.Text>
                    <Row className="mt-0">
                      <Col xs={12}>
                          <p className='fs-1 fw-bold'>
                            {initialQty}x 
                            <ArrowRight/>
                            {stagedQty}x
                        </p>
                      </Col>
                      <Col xs={12}>
                          <QtyChangeBadge
                            qtychange = {stagedQty - initialQty}
                            fontSize={3}
                          />
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Container
                    fluid
                    className="overflow-hidden"
                  >
                        <ButtonGroup
                          className="d-flex"
                        >
                            <Button
                              variant="success"
                              onClick={incQty}
                            >
                              <span
                                className="fs-3 m-0 fw-bold"
                              >
                                +
                              </span>
                            </Button>
                            <Button
                              disabled={stagedQty === 0}  
                              variant="danger"
                              onClick={decQty}
                            >
                            <span
                                className="fs-3 m-0 fw-bold"
                              >
                                -
                              </span>
                            </Button>
                        </ButtonGroup>
                  </Container>
                </Card.Footer>
              </Card>
    )


  }


  const Stage = ({
    selectedSize,
    itemData,
    changes,
    stageQtyChange,
  }) =>{

    let [selectedSize_initialQty,setSelectedSize_initialQty] = useState(null)
    let [selectedSize_stagedQty,setSelectedSize_stagedQty] = useState(null)

    useEffect(()=>{
        if(selectedSize === null){
            return
        }
        const targetSizeObj = itemData.sizes.find((sizeObj)=>sizeObj.size === selectedSize)
        if(targetSizeObj === undefined){
            throw Error("selected size could not be located within itemData sizes array.")
        }
        setSelectedSize_initialQty(targetSizeObj.qty)
        const stagedChange = changes.find((change)=>change.size === selectedSize)
        let proposedQtyChange
        if(stagedChange === undefined){
            proposedQtyChange = 0
        }
        if(stagedChange !== undefined){
            proposedQtyChange = stagedChange.qtyChange
        }


        console.log(targetSizeObj.qty + proposedQtyChange)

        setSelectedSize_stagedQty(targetSizeObj.qty + proposedQtyChange)
    },[selectedSize,changes])


    return selectedSize === null ? 
    <span className="text-muted">Select a size...</span> 
    : 
    <ChangeStager initialQty={selectedSize_initialQty} stagedQty={selectedSize_stagedQty} incQty={()=>{stageQtyChange(selectedSize,1)}} decQty={()=>{stageQtyChange(selectedSize,-1)}}/>
  }





const AmmendItemPage = ({itemData}) => {
    let [selectedSize,setSelectedSize] = useState(null)
    let [changes,setChanges] = useState([])


    function stageQtyChange(size,qty){
        setChanges((prevState)=>{
            let detached_prevState = JSON.parse(JSON.stringify(prevState))

            let targetChangeObj = detached_prevState.find((change) => change.size === size)

            if(targetChangeObj !== undefined){
                targetChangeObj.qtyChange += qty
            }

            if(targetChangeObj === undefined){
                targetChangeObj =  {
                    size:size,
                    qtyChange:qty,
                }
                detached_prevState.push(targetChangeObj)
            }

            if(targetChangeObj.qtyChange === 0){
                let targetIndex = detached_prevState.indexOf(detached_prevState.find((change)=>change.size === size))
                detached_prevState.splice(targetIndex,1)
                return detached_prevState
            }


            let targetSizeObj = itemData.sizes.find((sizeObj) => sizeObj.size === size)

            if(targetSizeObj === undefined){
                throw Error("sizeObj couldnt be located for selected size")
            }

            targetChangeObj.newFinalQty = (targetSizeObj.qty + targetChangeObj.qtyChange)


            if(targetChangeObj.newFinalQty < 0){
                targetChangeObj.qtyChange += (-1 * targetChangeObj.newFinalQty)
                targetChangeObj.newFinalQty = 0
            }

            console.log(detached_prevState)
            return detached_prevState
        })
    }





    return (
        <ItemPageStandard
            itemTitle={itemData.title}
            itemColour={itemData.colour}
            itemImgURL={itemData.imgURL}
            ImageFooterElem={() => {
                return (
                <Row className={"gy-3"}>
                    <Col xs={12}>
                        <SizingSelector
                            sizingData={itemData.sizes}
                            setSelectedSize={setSelectedSize}
                            selectedSize={selectedSize}
                        />
                    </Col>
                    <Col xs={12}>
                        <AddNewSizeButton/>
                    </Col>
                </Row>
                )
            }}
        >
            <Row>
                <Col xs={8}>
                    <Stage
                        selectedSize={selectedSize}
                        itemData={itemData}
                        changes={changes}
                        stageQtyChange={stageQtyChange}
                    />
                </Col>
                <Col>
                    <ChangesDisplay
                        unsavedChanges={changes}
                        setUnsavedChanges={setChanges}
                    />
                </Col>
            </Row>


        </ItemPageStandard>
    )
}

AmmendItemPage.propTypes = {}

export default AmmendItemPage