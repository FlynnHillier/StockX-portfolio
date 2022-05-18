import React,{useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { ArrowRight } from 'react-bootstrap-icons'
import ReactRouterPrompt from "react-router-prompt"

import axios_default from '../../api/axios'

import { Row,Col, ButtonGroup,Button,Container,Card,ListGroup,Badge,Modal,Spinner } from 'react-bootstrap'
import ItemPageStandard from '../../components/stock/ItemPageStandard'
import "./style.css"


const OnPageLeave = ({isChanges}) => {
    return (
      <ReactRouterPrompt
       when={isChanges}
      >
      {({ isActive, onConfirm, onCancel }) => (
      <Modal show={isActive}>
        <Modal.Title>
          Unsaved changes.
        </Modal.Title>
        <Modal.Body>
          are you sure you want to leave? any changes you have made are not saved.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onCancel}>
              Close
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              confirm leave
            </Button>
          </Modal.Footer>
      </Modal>
    )}
    </ReactRouterPrompt>
    )
}


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


  const AddNewSizeModal = ({
    isActive,
    setIsActive,
    handleAddSize,
    sizes
  }) => {
    function handleClose(){
      setIsActive(false)
    }
  
    const maxSize = 14
    const minSize = 4

    let currentlyOwnedSizes = []
    for(let sizeObj of sizes){
      currentlyOwnedSizes.push(sizeObj.size)
    }
  
    let sizesAvailableForAdd = []
    for(let c = minSize; c <= maxSize;c += 0.5){
      if(!(currentlyOwnedSizes.includes(c))){
        sizesAvailableForAdd.push(
            {size:c}
          )
      }
    }
  
    let [selectedSizeForAdd,setSelectedSizeForAdd] = useState(sizesAvailableForAdd[0].size)
    return ( 
      <Modal show={isActive}>
        <Modal.Title>
          Add new size
        </Modal.Title>
        <Modal.Body>
          <SizingSelector
            sizingData={sizesAvailableForAdd}
            selectedSize={selectedSizeForAdd}
            setSelectedSize={setSelectedSizeForAdd}
          />
          <p className='text-muted'>sizes displayed may not acctually exist.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>
            close
          </Button>
          <Button onClick={()=>{
            handleAddSize(selectedSizeForAdd)
          }}>
            add
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }



  const AddNewSizeButton = ({
      setSizes,
      sizes,
      setSelectedSize,
      setChanges,
      commitChangeToServer
  }) => {



    let [showModal,setShowModal] = useState(false)

    function addNewSize(size){
        setSizes((prevState)=>{
            let detached_prevState = JSON.parse(JSON.stringify(prevState))

            detached_prevState.push({
                size:size,
                qty:0,
                isNew:true,
            })

            return detached_prevState
        })

        setChanges((prevState)=>{
          let detached_prevState = JSON.parse(JSON.stringify(prevState))

          detached_prevState.push({
              size:size,
              qtyChange:1,
              newFinalQty:1
          })

          return detached_prevState
      })

        setSelectedSize(size)
    }

    return (
        <>
          <AddNewSizeModal
            isActive={showModal}
            setIsActive={setShowModal}
            handleAddSize={addNewSize}
            sizes={sizes}
          />
          <ButtonGroup className="d-flex">
            <Button
                variant="success"
                onClick={()=>{
                    setShowModal(true)
                }}
            >
                add another size.
            </Button>
        </ButtonGroup>
        </>
    )

  }

  const ChangesDisplay = ({
      unsavedChanges,
      setUnsavedChanges,
      onSaveChanges
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
                onClick={onSaveChanges}
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
    sizes,
    stageQtyChange,
  }) =>{

    let [selectedSize_initialQty,setSelectedSize_initialQty] = useState(null)
    let [selectedSize_stagedQty,setSelectedSize_stagedQty] = useState(null)

    useEffect(()=>{
        if(selectedSize === null){
            return
        }
        const targetSizeObj = sizes.find((sizeObj)=>sizeObj.size === selectedSize)
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

        setSelectedSize_stagedQty(targetSizeObj.qty + proposedQtyChange)
    },[selectedSize,changes])


    return selectedSize === null ? 
    <span className="text-muted">Select a size...</span> 
    : 
    <ChangeStager initialQty={selectedSize_initialQty} stagedQty={selectedSize_stagedQty} incQty={()=>{stageQtyChange(selectedSize,1)}} decQty={()=>{stageQtyChange(selectedSize,-1)}}/>
  }



  const ModalLoading = ({show,text}) => {
    return (
        <Modal
            show={show}
        >
            <Container fluid className="py-3">
                <Row className="gy-3">
                    <Col xs={12} className="d-flex justify-content-center">
                        <Spinner animation='border'></Spinner>
                    </Col>
                    <Col xs={12} className="text-center">
                        <span className="text-muted"> {text}</span>
                    </Col>
                </Row>
            </Container>
        </Modal>
    )
}


const ErrorDisplay = ({errorMessage}) => {
  return errorMessage === undefined || errorMessage === "" ? <></> :
  <Container className={"text-center errorMessageBox2 p-2 my-3"}>
      {`ERROR: ${errorMessage}`}
  </Container> 
}



const AmmendItemPage = ({itemData,setCurrentStockIsInitialised,setItemsForInit}) => {
    let [selectedSize,setSelectedSize] = useState(null)
    let [changes,setChanges] = useState([])
    let [sizes,setSizes] = useState(itemData.sizes)
    let [errorMessage,setErrorMessage] = useState("")
    let [isSaving,setIsSaving] = useState(false)

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


            let targetSizeObj = sizes.find((sizeObj) => sizeObj.size === size)
            if(targetSizeObj === undefined){
                throw Error("sizeObj couldnt be located for selected size")
            }

            targetChangeObj.newFinalQty = (targetSizeObj.qty + targetChangeObj.qtyChange)


            if(targetChangeObj.newFinalQty < 0){
                targetChangeObj.qtyChange += (-1 * targetChangeObj.newFinalQty)
                targetChangeObj.newFinalQty = 0
            }
            
            return detached_prevState
        })
    } 



    function commitChangesToServer(){
      return new Promise(async (resolve,reject)=>{
        let sizeQty_ForIncrease = []
        let sizeQty_ForDecrease = []
        const urlKey = itemData.urlKey
        const imgURL = itemData.imgURL
        const title = itemData.title
        const colour = itemData.colour
        for(let change of changes){
          if(change.qtyChange > 0){
            sizeQty_ForIncrease.push(
              {
                size:change.size,
                qty:change.qtyChange
              }
            )
          }
          if(change.qtyChange < 0){
            sizeQty_ForDecrease.push(
              {
                size:change.size,
                qty:(change.qtyChange) * -1
              }
            )
          }

          if(change.qtyChange == 0){
            console.log("qtyChange is 0 - should not occur. Logic error.")
          }
        }

        function buildQuery(urlKey,updateData){
          return {
            updates:[
              {
                imgURL:imgURL,
                title:title,
                colour:colour,
                urlKey:urlKey,
                sizes:updateData
              }
            ]
          }
        }

        const incQuery = buildQuery(urlKey,sizeQty_ForIncrease)
        const decQuery = buildQuery(urlKey,sizeQty_ForDecrease)

        let pendingPromises = []
        function buildRequest(url,payload){
          return new Promise((resolve,reject)=>{
            axios_default.post(
                url,
                payload,
                {
                  headers:{
                    "content-type":"application/json"
                  }
                }
              )
              .catch((err)=>{
                reject(
                  {
                    message:"error on request.",
                    error:err
                  }
                )
              })
              .then((response)=>{
                if(response.data.result === true){
                  resolve()
                } else{
                  reject(
                    {
                      message:"server responded with response result not true",
                      response:response.data
                    }
                  )
                }
              })
          })
        }

        if(sizeQty_ForDecrease.length !== 0){
          pendingPromises.push(buildRequest("/api/private/stock/item/remove",decQuery))
        }
        if(sizeQty_ForIncrease.length !== 0){
          pendingPromises.push(buildRequest("/api/private/stock/item/add",incQuery))
        }

        await Promise.all(pendingPromises)
        .catch((err)=>{
          reject(err)
        })

        resolve()
      })
   }


   async function onSaveChanges(){
    setErrorMessage("")
    setIsSaving(true)
    try {
      const serverResponse = await commitChangesToServer()
      setItemsForInit([itemData.urlKey])
      setCurrentStockIsInitialised(false)
    } catch(err){
      console.error(err)
      setErrorMessage("an error occured while attempting to save your changes.")
    } finally{
      setIsSaving(false)
    }
   }





    return (
        <>
            <ModalLoading show={isSaving} text={"saving.."}/>
            <OnPageLeave
                isChanges={changes.length !== 0}
            />
            <ItemPageStandard
                itemTitle={itemData.title}
                itemColour={itemData.colour}
                itemImgURL={itemData.imgURL}
                ImageFooterElem={() => {
                    return (
                    <Row className={"gy-3"}>
                        <Col xs={12}>
                            <SizingSelector
                                sizingData={sizes}
                                setSelectedSize={setSelectedSize}
                                selectedSize={selectedSize}
                            />
                        </Col>
                        <Col xs={12}>
                            <AddNewSizeButton
                                 setSizes={setSizes}
                                 sizes={sizes}
                                 setSelectedSize={setSelectedSize}
                                 setChanges={setChanges}
                            />
                        </Col>
                    </Row>
                    )
                }}
            >
              
                <Row>
                    <Col xs={8}>
                        <ErrorDisplay errorMessage={errorMessage}/>
                        <Stage
                            selectedSize={selectedSize}
                            itemData={itemData}
                            changes={changes}
                            sizes={sizes}
                            stageQtyChange={stageQtyChange}
                        />
                    </Col>
                    <Col>
                        <ChangesDisplay
                            unsavedChanges={changes}
                            setUnsavedChanges={setChanges}
                            onSaveChanges={onSaveChanges}
                        />
                    </Col>
                </Row>
            </ItemPageStandard>
        </>
    )
}

AmmendItemPage.propTypes = {}

export default AmmendItemPage