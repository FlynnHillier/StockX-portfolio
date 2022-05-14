import React,{useContext,useEffect,useState} from 'react'
import ItemPageStandard from '../../components/stock/ItemPageStandard'
import StockContext from '../../context/StockProvider'
import { useParams,useLocation,useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'


import { Row,Col,Container } from 'react-bootstrap'
import LoadingModal from '../../components/misc/LoadingModal'
import AmmendItemPage from './AmmendItemPage'




const AmmendItem = ({}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const {itemID} = useParams()
    const {currentStock} = useContext(StockContext)

    function pageInit(){
        function getItemData(){
            if(location.state){
                if(location.state.currentItemData !== undefined){
                    return location.state.currentItemData
                }
            }

            const itemDataFromCurrentStockContext = currentStock.find((item)=>item.urlKey === itemID)
            if(itemDataFromCurrentStockContext !== undefined){
                return itemDataFromCurrentStockContext
            }

            return null
        }
        const retrievedItemData = getItemData()
        if(retrievedItemData === null){
            navigate("/stock/current")
        }
        setCurrentItemData(retrievedItemData)
        setPageIsLoading(false)
    }

    useEffect(()=>{
        pageInit()
    },[])


    let [pageIsLoading,setPageIsLoading] = useState(true)
    let [currentItemData,setCurrentItemData] = useState(null)

    return (
        <>
            <LoadingModal
                show={pageIsLoading}
                message={"page is loading. This message should not appear for long. if it is, refresh the page."}
            />

            {
                pageIsLoading ? 
                <>-x-</> 
                :
                <AmmendItemPage
                    itemData = {currentItemData}
                >

                </AmmendItemPage>                 
            }
        </>
    )
}

AmmendItem.propTypes = {}

export default AmmendItem