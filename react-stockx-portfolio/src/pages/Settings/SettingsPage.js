import React,{useEffect, useState,useContext} from 'react'
import PropTypes from 'prop-types'
import { InputGroup, Modal } from 'react-bootstrap'
import ReactRouterPrompt from "react-router-prompt"
import "./style.css"
import { Row,Col, Container,Card,Button,ListGroup,FormControl,FormGroup,FormLabel, ListGroupItem, Form } from 'react-bootstrap'

import axios_default from '../../api/axios'
import SettingsContext from '../../context/SettingsProvider'


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




const SettingsDisplay = ({settingsData,setSettingsData,setChanges}) => {

    const fee_onInput = (e)=>{
        if(e.target.value > 100){
            e.target.value = 100
        }
        if(e.target.value < 0){
            e.target.value = 0
        }
        if(e.target.value.substring(0,1) == 0 && e.target.value.length > 1){
            e.target.value = 0
        }

        setChanges((prevState)=>{
            let detached_prevState = JSON.parse(JSON.stringify(prevState))
            let target = detached_prevState.find((change)=>change.name === "fee")

            if(target === undefined){
                detached_prevState.push({
                    name:"fee",
                    value:e.target.value
                })
            }
            if(target !== undefined){
                target.value = e.target.value
            }

            if(detached_prevState.find((change)=>change.name === "fee").value == settingsData.fee){
                detached_prevState.splice(detached_prevState.indexOf(detached_prevState.find((change)=>change.name === "fee")),1)
            }
            return detached_prevState
        })
    }



    return (
        <ListGroup>
            <ListGroupItem className="border-0">
                <FormGroup>
                    <FormLabel as={"h5"}> fee % </FormLabel>
                    <Row>
                        <Col>
                        </Col>
                        <Col xs={6} md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    {settingsData.fee}% 
                                </InputGroup.Text>
                                <FormControl
                                    className="text-center fw-strong hideArrows"
                                    placeholder={settingsData.fee}
                                    type={"number"}
                                    onInput={(e)=>{
                                        fee_onInput(e)
                                    }}
                            />
                            </InputGroup>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </FormGroup>
            </ListGroupItem>
        </ListGroup>
    )
}



const SettingsPage = ({}) => {

  const {settings,setSettings} = useContext(SettingsContext)


  let [changes,setChanges] = useState([])


  function commitToServer(updates){
      return new Promise(async (resolve,reject)=>{
            try {
                const serverResponse = await axios_default.post(
                    "/api/private/settings/ammend",
                    {
                        updates:updates
                    }
                ) 

                if(serverResponse.status !== 200){
                    throw Error(`server responded with unexpected status: ${serverResponse.status} , when attempting to commit changes to server.`)
                }

                resolve(serverResponse.data)

            } catch(err){
                reject(err)
            }
      })
  }


  function buildUpdatedSettingsObj(changes,previousSettings){

    for(let change of changes){
        previousSettings[change.name] = change.value
    }

    return previousSettings
  }



  async function onFormSubmit(e){
    e.preventDefault()
    if(changes.length !== 0){
        const updatedSettingsObj = buildUpdatedSettingsObj(changes,settings)
        try {
            const updatedSettings = await commitToServer(updatedSettingsObj)
            setChanges([])
        } catch(err){
            console.error(err)
        }
        
    }
  }


  return (
    <>  
        <OnPageLeave
            isChanges={changes.length !== 0}
        />
        <Row>
            <Col>
            </Col>
            <Col 
                xs={10}  
                sm={8} 
                xl={6}
                className="text-center d-flex justify-content-center"
            >
                <Container fluid>
                    <form 
                        className='border-0'
                        onSubmit={onFormSubmit}
                    >
                        <Card>
                            <Card.Header as={"h3"}>
                                Settings
                            </Card.Header>
                            <Card.Body>
                                <SettingsDisplay
                                    settingsData={settings}
                                    setSettingsData={setSettings}
                                    setChanges={setChanges}
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-start">
                                <button
                                    disabled={changes.length === 0}
                                    className='btn btn-success my-1'
                                >
                                    Save
                                </button>
                            </Card.Footer>
                        </Card>
                    </form>
                </Container>
            </Col>
            <Col>
            </Col>
        </Row>
    </>
  )
}

SettingsPage.propTypes = {}

export default SettingsPage