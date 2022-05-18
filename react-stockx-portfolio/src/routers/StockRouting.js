import react,{ useContext } from 'react'
import StockContext from './../context/StockProvider'

import { Navigate,Outlet } from 'react-router-dom'

import LoadCurrentStockPage from '../pages/loadCurrentStockPage/LoadCurrentStockPage'




const IsStockLoaded = () => {
    let {currentStockIsInitialised} = useContext(StockContext)
    return currentStockIsInitialised
}


const StockRouter = () => {
    return IsStockLoaded() ? <Outlet/> : <LoadCurrentStockPage/>
}


export default StockRouter