import React,{useState,useEffect} from 'react'
import PropTypes from 'prop-types'
import { InputGroup,Button,FormControl ,Container, Row, Col,Card,Image, ListGroup} from 'react-bootstrap'
import "./style.css"

import axios_default from '../../api/axios'





const SearchResultItem = ({itemData}) => {
    return (
        <Card
            className="text-wrap flex-row flex-wrap border-light searchResult searchResult_item"
            onClick={()=>{
                console.log(itemData.urlKey)
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




const SearchResultTable = ({resultData}) => {
    return (
        <Container fluid>
            <ListGroup
                variant='flush'
            >
                {
                    resultData.map((data)=>{
                        return (
                            <ListGroup.Item>
                                <SearchResultItem itemData={data}/>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </Container>
    )
}



const SearchResultView = ({resultData}) => {
    return (
        <Container
            fluid
            className="p-3 border"
        >
            {
                resultData.length === 0 ? <span className='text-center'><p className="text-muted">nothing too see here yet..</p></span> : <SearchResultTable resultData={resultData}/>
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
    <>
        ERROR: {errorMessage}
    </> 
}


const AmmendCurrentStockPage = props => {
    let [currentSearchQuery,setCurrentSearchQuery] = useState("")
    let [searchAllowed,setSearchAllowed] = useState(true)
    let [searchIsPending,setSearchIsPending] = useState(false)
    let [errorMessage,setErrorMessage] = useState("")

    let [resultantSearchedData,setResultantSearchedData] = useState([])

    function onSearch(searchQuery){
        setErrorMessage("")
        if(searchQuery !== ""){
            sendSearchQuery(searchQuery)
        }
    }


    async function sendSearchQuery(query){
        setSearchIsPending(true)
        setCurrentSearchQuery("")
        try{
            const response = await axios_default.post(
                "/api/private/stockx/search",
                {
                    search_query:query
                }
            )

            if(!(response.status === 200)){
                throw Error({
                    message:`server responded with unexpected code: ${response.status}`
                })
            }

            setResultantSearchedData(response.data.data)

        }  catch(err){
            console.error(err)
            setErrorMessage(err.message ? err.message : "An unknown error occured.")
        } finally{
            setSearchIsPending(false)
        }
    }


    useEffect(()=>{
        console.log(resultantSearchedData)
    },[resultantSearchedData])

    useEffect(()=>{
        if(searchIsPending === true){
            setSearchAllowed(false)
        }
        if(searchIsPending === false){
            setSearchAllowed(true)
        }
    },[searchIsPending])

    return (
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
                
                <SearchResultView resultData={resultantSearchedData}/>
            </Col>

            <Col>
            </Col>
        </Row>
    )
}

AmmendCurrentStockPage.propTypes = {}

export default AmmendCurrentStockPage