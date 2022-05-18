import React,{useState,useEffect} from 'react'
import PropTypes from 'prop-types'
import { InputGroup,Button,FormControl ,Container, Row, Col,Card,Image, ListGroup,Modal,Spinner} from 'react-bootstrap'
import "./style.css"

import {useNavigate} from "react-router-dom"

import axios_default from '../../api/axios'





const SearchResultItem = ({itemData,onItemSelect}) => {
    return (
        <Card
            className="text-wrap flex-row flex-wrap border-light searchResult searchResult_item"
            onClick={()=>{
                onItemSelect(itemData.urlKey)
            }}
        >
            <Image
                height={"100px"}
                src={itemData.media.thumbUrl}
            />
            <Card.Body>
                <Card.Title as="h5">
                    {itemData.title || "*default_title*"}
                </Card.Title>
                <Card.Subtitle
                    className="text-muted"
                >
                    {`${itemData.type}, ${itemData.colorway}` || "*default item-info*"}
                </Card.Subtitle>
            </Card.Body>
        </Card>
    )
}




const SearchResultTable = ({resultData,onItemSelect}) => {
    return (
        <Container fluid>
            <ListGroup
                variant='flush'
            >
                {
                    resultData.map((data)=>{
                        return (
                            <ListGroup.Item>
                                <SearchResultItem onItemSelect={onItemSelect}  itemData={data}/>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </Container>
    )
}



const SearchResultView = ({resultData,onItemSelect}) => {
    return (
        <Container
            fluid
            className="p-3 border"
        >
            {
                resultData.length === 0 ? <span className='text-center'><p className="text-muted">nothing too see here yet..</p></span> : <SearchResultTable onItemSelect={onItemSelect}  resultData={resultData}/>
            }
        </Container>
    )
}


const SearchBar = ({onSearch,setSearchState,searchState,disabled}) => {
    return (
        <form
                onSubmit={(e)=>{
                    e.preventDefault()
                    onSearch()
                }}
            >

                <InputGroup className="mb-3">
                    <button 
                    disabled={disabled}
                    className='btn btn-primary'>
                        Search
                    </button>
                    <FormControl
                        disabled={disabled}
                        value={searchState}
                        onInput={(e)=>setSearchState(e.target.value)}
                        type='text'
                        className="AmmendCurrenStock"
                        placeholder='search for your item...'
                    />
                </InputGroup>
            </form>
        )
}

const ErrorDisplay = ({errorMessage}) => {
    return errorMessage === undefined || errorMessage === "" ? <></> :
    <Container className={"text-center errorMessageBox p-2 my-3"}>
        {`ERROR: ${errorMessage}`}
    </Container> 
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




const AmmendCurrentStockPage = props => {
    const navigate = useNavigate()

    let [currentSearchQuery,setCurrentSearchQuery] = useState("")
    let [searchAllowed,setSearchAllowed] = useState(true)
    let [searchIsPending,setSearchIsPending] = useState(false)
    let [errorMessage,setErrorMessage] = useState("")

    let [resultantSearchedData,setResultantSearchedData] = useState([])

    let [itemIsSelected,setItemIsSelected] = useState(false)
    let [selectedItemData,setSelectedItemData] = useState(null)
    let [isLoadingItemData,setIsLoadingItemData] = useState(false)

    function formatMetaInfoForAmmendPage(metaInfo){
        let objForReturn = {}
        objForReturn.imgURL = metaInfo.media.imageUrl
        objForReturn.colour = metaInfo.colour
        objForReturn.title = metaInfo.title
        objForReturn.urlKey = metaInfo.urlKey
        objForReturn.sizes = []
        return objForReturn
    }

    function retrieveItemMetaInfo(urlKey){
        return new Promise(async (resolve,reject)=>{
            try {
                const serverResponse = await axios_default.post(
                    "/api/private/stockx/meta",
                    {
                        urlKey:urlKey
                    },
                    {
                        headers:{
                            "content-type":"application/json"
                        }
                    }
                )

                if(serverResponse.status !== 200){
                    reject(`server responded with unexpected status code: ${serverResponse.status}`)
                    return
                }


                const metaInfo = serverResponse.data.data
                
                //formulate selectableSizes Arr
                let selectableSizes = []
                for(let variant of metaInfo.variants){
                    if(variant.hidden === true){
                        continue
                    }
                    selectableSizes.push(variant.traits.size)
                }
                metaInfo.variants = undefined
                metaInfo.selectableSizes = selectableSizes

                //traits
                const traits = metaInfo.traits
                metaInfo.styleCode = (traits.find((trait)=>trait.name === "Style") || {}).value
                metaInfo.colour = (traits.find((trait)=>trait.name === "Colorway")|| {}).value
                
                metaInfo.traits = undefined

                resolve(metaInfo) 
            }  catch(err){
                console.log("error caught!")
            }
        })
        
    }


    async function onItemSelect(urlKey){
        try {
            setIsLoadingItemData(true)
            setItemIsSelected(true)
            const data = await retrieveItemMetaInfo(urlKey)
            setSelectedItemData(data)
        } catch(err){
            setItemIsSelected(false)
            console.error(err)
            setErrorMessage(err.msg ? err.msg : "an unexpected error occured while retrieving item Meta info.")
        } finally{
            setIsLoadingItemData(false)
        }

    }


    async function onSearch(searchQuery){

        function sendSearchQuery(query){
            return new Promise(async (resolve,reject)=>{
               try{
                   const serverResponse = await axios_default.post(
                       "/api/private/stockx/search",
                       {
                           search_query:query
                       }
                   )
                   
                   if(serverResponse.data.result === true){
                       console.log(serverResponse.data.data)
                       resolve(serverResponse.data.data)
                   }
                   
                   throw {
                       accessDenied:serverResponse.data.isAccessDenied
                   }
                   
               }  catch(err){
                
                   reject(err)
               }
            })
        }

        function searchAttempts(maxAttempt,attempt=0){
            return new Promise((resolve,reject)=>{
                sendSearchQuery(searchQuery)
                .then((data)=>{
                    resolve(data)
                })
                .catch((err)=>{
                    if(err.accessDenied === true){
                        if(!(attempt > maxAttempt)){
                            resolve(searchAttempts(maxAttempt,attempt + 1))
                        } else{
                            reject(`after ${maxAttempt} attempt(s) to search for '${searchQuery}', data could still not be retrieved.`)
                         }
                    } else{
                        reject(err)
                    }
                })
            })
        }


        setErrorMessage("")
        if(searchQuery === ""){
            return
        }

        setSearchIsPending(true)

        try {

            const maxSearches = 5

            const data = await searchAttempts(maxSearches) 
            setResultantSearchedData(data)



        } catch(err){
            setErrorMessage(err)
        } finally{
            setCurrentSearchQuery("")
            setSearchIsPending(false)
        }
    }


    useEffect(()=>{

        if(selectedItemData !== null){
            navigate(
                `../view/${selectedItemData.urlKey}/ammend`,
                {
                    state:{
                        currentItemData:formatMetaInfoForAmmendPage(selectedItemData)
                    }
                }
            )
        }
    },[selectedItemData])

    useEffect(()=>{
        if(searchIsPending === true){

            setSearchAllowed(false)
        }
        if(searchIsPending === false){
            setSearchAllowed(true)
        }
    },[searchIsPending])

    return (
        <>
            <ModalLoading
                show={isLoadingItemData}
                text={"retrieving item Meta info..."}
            />
            <ModalLoading
                show={searchIsPending}
                text={`searching for '${currentSearchQuery}'`}
            />


            <Row>
                <Col>
                </Col>
                <Col
                    xs={10} md={8} xl={6} xxl={6}
                >
                    <SearchBar
                        disabled={!searchAllowed}
                        onSearch={()=>{
                            onSearch(currentSearchQuery)
                        }}
                        searchState={currentSearchQuery}
                        setSearchState={setCurrentSearchQuery}
                    />
                    <ErrorDisplay errorMessage={errorMessage}/>
                    
                    <SearchResultView 
                        resultData={resultantSearchedData}
                        onItemSelect={onItemSelect}
                    />
                </Col>

                <Col>
                </Col>
            </Row>
        </>
    )
}

AmmendCurrentStockPage.propTypes = {}

export default AmmendCurrentStockPage