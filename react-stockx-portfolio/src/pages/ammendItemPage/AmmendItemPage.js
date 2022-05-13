import React,{useContext,useEffect,useState} from 'react'
import { ArrowRight } from 'react-bootstrap-icons'
import { useParams} from 'react-router-dom'

import axios_default from '../../api/axios'

import PropTypes from 'prop-types'


import "./style.css"

import ReactRouterPrompt from "react-router-prompt"
import StockContext from '../../context/StockProvider'
import { Modal,Container,Row,Col,Button,ButtonGroup,Card,Badge,ListGroup,InputGroup,FormControl  } from 'react-bootstrap'

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





const QtyChangeBadge = ({qtychange,fontSize}) => {
  let  bgColor
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






const SizeQuantityEdit = ({
  staticQty,
  changingQty,
  editQty,
  qtyChange,
}) => {

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
                            {staticQty}x 
                            <ArrowRight/>
                            {changingQty}
                        </p>
                      </Col>
                      <Col xs={12}>
                          <QtyChangeBadge
                            qtychange = {qtyChange}
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
                              onClick={()=>{
                                editQty(+1)
                              }}
                            >
                              <span
                                className="fs-3 m-0 fw-bold"
                              >
                                +
                              </span>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={()=>{
                                editQty(-1)
                              }}
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



const UnsavedChangesDisplay = ({
  unsavedChanges,
  removeChange,
  onSaveChanges,
  saveChangesButtonIsDisabled
}) => {



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
              disabled={saveChangesButtonIsDisabled}
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





const AddNewSizeModal = ({isActive,setIsActive,unsavedCurrentItemData,setNewlyAddedSizes,setUnsavedCurrentItemData,setSelectedSize}) => {

  function handleClose(){
    setIsActive(false)
  }

  function handleAddSize(size){
    setNewlyAddedSizes((prevState)=>{
      prevState.push(size)
      return prevState
    })
    setUnsavedCurrentItemData((prevState)=>{
      prevState.sizes.push({
        size:size,
        qty:1
      })
      return prevState
    })
    setSelectedSize(size)
  }

  const maxSize = 14
  const minSize = 4

  let currentlyOwnedSizes = []
  for(let sizeObj of unsavedCurrentItemData.sizes){
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
          handleClose()
        }}>
          add
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


const AddNewSizeButton = ({unsavedCurrentItemData,setUnsavedCurrentItemData,setSelectedSize,setNewlyAddedSizes}) => {

  let [showModal,setShowModal] = useState(false)
  return (
    <>
      <AddNewSizeModal
        isActive={showModal}
        setIsActive={setShowModal}
        unsavedCurrentItemData={unsavedCurrentItemData}
        setNewlyAddedSizes={setNewlyAddedSizes}
        setUnsavedCurrentItemData={setUnsavedCurrentItemData}
        setSelectedSize={setSelectedSize}
      />
      <Row>
        <Col xs={12}>
          <ButtonGroup
            className="d-flex"
          >
            <Button
                variant="success"
                onClick={()=>{
                  setShowModal(true)
                }}
            >
              + new size
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </>
  )
}










const AmmendItem = ({itemData}) => {

  const {setCurrentStockIsInitialised} = useContext(StockContext)

   let [savedCurrentItemData,setSavedCurrentItemData] = useState(JSON.parse(JSON.stringify(itemData)))
   let [unsavedCurrentItemData,setUnsavedCurrentItemData] = useState(JSON.parse(JSON.stringify(itemData)))

   let [selectedSize,setSelectedSize] = useState(savedCurrentItemData.sizes[0].size)


   let [savedSelectedSizeData,setSavedSelectedSizeData] = useState(savedCurrentItemData.sizes.find((sizeObj)=>sizeObj.size === selectedSize))
   let [unsavedSelectedSizeData,setUnsavedSelectedSizeData] = useState(unsavedCurrentItemData.sizes.find((sizeObj)=>sizeObj.size === selectedSize))
   let [selectedSizeQtyChange,setSelectedSizeQtyChange] = useState(0)

   let [unsavedChangesLog,setUnsavedChangesLog] = useState([])

   let [newlyAddedSizes,setNewlyAddedSizes] = useState([])

   let [selectedSizeInitialQty,setSelectedSizeInitialQty] = useState(-1)


   let [saveChangesButtonIsClicked,setSaveChangesButtonIsClicked] = useState(false)



   function commitChangesToServer(){
      return new Promise(async (resolve,reject)=>{
        let sizeQty_ForIncrease = []
        let sizeQty_ForDecrease = []

        const urlKey = unsavedCurrentItemData.urlKey
        const imgURL = unsavedCurrentItemData.imgURL
        const title = unsavedCurrentItemData.title
        const colour = unsavedCurrentItemData.colour

        for(let change of unsavedChangesLog){
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

        if(sizeQty_ForDecrease.length !== 0){
          pendingPromises.push(
            new Promise((resolve,reject)=>{
              axios_default.post(
                  "/api/private/stock/item/remove",
                  decQuery,
                  {
                    headers:{
                      "content-type":"application/json"
                    }
                  }
                )
                .catch((err)=>{
                  reject(
                    {
                      message:"error on decremement",
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
                        message:"increment - server responded with response result not true",
                        response:response.data
                      }
                    )
                  }
                })
            })
          )
        }


        if(sizeQty_ForIncrease.length !== 0){
          pendingPromises.push(
            new Promise((resolve,reject)=>{
              axios_default.post(
                  "/api/private/stock/item/add",
                  incQuery,
                  {
                    headers:{
                      "content-type":"application/json"
                    }
                  }
                )
                .catch((err)=>{
                  reject(
                    {
                      message:"error on increment",
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
                        message:"increment - server responded with response result not true",
                        response:response.data
                      }
                    )
                  }
                })
            })
          )
        }




        await Promise.all(pendingPromises)
        .catch((err)=>{
          reject(err)
        })

        resolve()
      })
   }




    useEffect(()=>{
      const saved_targetSizeObj = savedCurrentItemData.sizes.find((sizeObj)=>sizeObj.size === selectedSize)
      const unsaved_targetSizeObj = unsavedCurrentItemData.sizes.find((sizeObj)=>sizeObj.size === selectedSize)

      setSavedSelectedSizeData(saved_targetSizeObj)
      setUnsavedSelectedSizeData(unsaved_targetSizeObj)
      setSelectedSizeInitialQty(()=>{
        if(newlyAddedSizes.includes(selectedSize)){
          return 0
        } else {
          return saved_targetSizeObj.qty
        }
      })
    },[selectedSize])


    useEffect(()=>{
      function qtyIsUnchanged(){
        return savedSelectedSizeData.qty === unsavedSelectedSizeData.qty
      } 

      function commitChangeToItem(){ //not causing issue.
        setUnsavedCurrentItemData(prevState=>{
          let targetSizeObj = prevState.sizes.find((sizeObj)=>sizeObj.size === unsavedSelectedSizeData.size)
          let indexOfTargetSize = prevState.sizes.indexOf(targetSizeObj)
          let tempObj = Object.assign({},prevState)
          tempObj.sizes[indexOfTargetSize] = unsavedSelectedSizeData
          return tempObj
        })
      }


      function updateSelectedSizeQtyChange(){
        setSelectedSizeQtyChange(unsavedSelectedSizeData.qty - selectedSizeInitialQty)
      }


      commitChangeToItem()
      updateSelectedSizeQtyChange()

    },[unsavedSelectedSizeData])


    useEffect(()=>{
      setSelectedSizeQtyChange(unsavedSelectedSizeData.qty - selectedSizeInitialQty)
    },[selectedSizeInitialQty])



    useEffect(()=>{

      function updateChangesLog(){

        let targetSize = unsavedSelectedSizeData.size
        setUnsavedChangesLog(previousState=>{
          let prevState = JSON.parse(JSON.stringify(previousState))

          let existingSizeObjInChanges = prevState.find((sizeObj)=>sizeObj.size === targetSize)
          let qtyChange = unsavedSelectedSizeData.qty - selectedSizeInitialQty
          let newFinalQty = selectedSizeInitialQty + qtyChange
          if(existingSizeObjInChanges !== undefined){
            if(qtyChange === 0){
              prevState.splice(prevState.indexOf(existingSizeObjInChanges),1)
            } else{
              existingSizeObjInChanges.qtyChange = qtyChange
              existingSizeObjInChanges.newFinalQty = newFinalQty
            }
          } 
          else{
            if(qtyChange !== 0){
              prevState.push({
                size:targetSize,
                qtyChange:qtyChange,
                newFinalQty:newFinalQty,
              })
            }
          }
          return prevState
        })
      }
      updateChangesLog()
    },[selectedSizeQtyChange])


  return (
    <>

      <OnPageLeave
        isChanges={unsavedChangesLog.length > 0}
      />

      <ItemPageStandard
        itemTitle={savedCurrentItemData.title}
        itemColour={savedCurrentItemData.colour}
        itemImgURL={savedCurrentItemData.imgURL}
        ImageFooterElem={
          () => {
            return (
              <Row className={"gy-3"}>
                <Col xs={12}>
                  <SizingSelector
                            setSelectedSize={setSelectedSize}
                            selectedSize={selectedSize}
                            sizingData={unsavedCurrentItemData.sizes}
                          />
                </Col>
                <AddNewSizeButton
                  unsavedCurrentItemData={unsavedCurrentItemData}
                  setNewlyAddedSizes={setNewlyAddedSizes}
                  setSelectedSize={setSelectedSize}
                  setUnsavedCurrentItemData={setUnsavedCurrentItemData}
                />
              </Row>
            )
          }

        }
      >
        
        <Row>
            <Col>
                <Container
                  className="mt-2 mt-lg-0 mx-2" 
                  fluid
                >
                  <Card
                    border="light"
                  >
                    <Card.Header as="h3">
                      {selectedSize} - edit
                    </Card.Header>
                    <Card.Body>
                          <SizeQuantityEdit
                            staticQty={selectedSizeInitialQty}  ///HERE
                            changingQty={unsavedSelectedSizeData.qty}
                            editQty={(change)=>{
                              setUnsavedSelectedSizeData((prevState)=>{
                                let tempObj = JSON.parse(JSON.stringify(prevState))
                                tempObj.qty = (tempObj.qty + change) < 0 ? 0 : tempObj.qty += change
                                return tempObj
                              })
                            }}
                            qtyChange={selectedSizeQtyChange}
                          />
                    </Card.Body>
                  </Card>
                </Container>
                </Col>
                <Col xxl={3} lg={5} md={5} xs={12}>
                  <UnsavedChangesDisplay

                            unsavedChanges={unsavedChangesLog}
                            saveChangesButtonIsDisabled={saveChangesButtonIsClicked}
                            onSaveChanges={async ()=>{
                              setSaveChangesButtonIsClicked(true)
                                try {
                                  await commitChangesToServer()
                                  setCurrentStockIsInitialised(false)
                                } catch(e){
                                  console.error(e)
                                }
                            }}

                            removeChange={(size)=>{
                              let savedSizeObj = savedCurrentItemData.sizes.find((sizeObj)=>sizeObj.size === size)
                              setUnsavedChangesLog((prevState)=>{
                                let prevState_detachedObj = JSON.parse(JSON.stringify(prevState))
                                let target = prevState_detachedObj.find((proposedChange)=>proposedChange.size === size)
                                prevState_detachedObj.splice(prevState_detachedObj.indexOf(target),1)
                                return prevState_detachedObj
                              })

                              if(newlyAddedSizes.includes(size)){


                                setNewlyAddedSizes((prevState)=>{
                                  prevState.splice(prevState.indexOf(size),1)
                                  return prevState
                                })
                                setUnsavedCurrentItemData((previousState)=>{ //if size is newly added
                                  let prevState = JSON.parse(JSON.stringify(previousState))
                                  let target = prevState.sizes.find((sizeObj)=>sizeObj.size === size)

                                  prevState.sizes.splice(prevState.sizes.indexOf(target),1)

                                  return prevState
                                })

                                setSelectedSize(unsavedCurrentItemData.sizes[0].size)

                              } else{
                                setUnsavedCurrentItemData((prevState)=>{ //if size existed previously
                                  let target = prevState.sizes.find((sizeObj)=>sizeObj.size === size)
                                  target.qty = savedSizeObj.qty
                                  return prevState
                                })

                                if(selectedSize === size){
                                  setSelectedSizeQtyChange(0)
                                }
                              }
                            }}
                          />
                </Col>
        </Row>


        </ItemPageStandard>
      </>
  )
}





const AmmendItemPage = () => {
  const {currentStock} = useContext(StockContext)
  const {itemID} = useParams()

  let [targetItem_outOfContext,setTargetItem_outOfContext] = useState(null)

  useEffect(()=>{
    let targetItem = currentStock.find((item) => item.urlKey === itemID)
    setTargetItem_outOfContext(JSON.parse(JSON.stringify(targetItem)))
  },[])


  return targetItem_outOfContext !== null ? 
  <AmmendItem
    itemData={targetItem_outOfContext}
  />
  :
  <>setting, out of context, target item.</>

}









AmmendItemPage.propTypes = {}

export default AmmendItemPage