import React,{useContext, useEffect} from 'react'

import StockContext from '../../context/StockProvider'


const LoadCurrentStockPage = () => {

    let {currentStock_init} = useContext(StockContext)

    useEffect(()=>{
        currentStock_init()
    },[])

  return (
   <>
    sit tight! we're just remembering all the items you own.
   </>
  )
}

export default LoadCurrentStockPage