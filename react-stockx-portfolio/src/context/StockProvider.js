import { createContext,useEffect,useState } from "react";

import axios_default from "./../api/axios";
import axios from "axios";



const StockContext = createContext({})

export const StockProvider = ({children}) => {

    let [currentStock,setCurrentStock] = useState([])
    let [currentStockIsInitialised,setCurrentStockIsInitialised] = useState(false)
    let [itemsForInit,setItemsForInit] = useState([])


    async function loadItemPricing(sizes,urlKey){
        const pricing = await axios_default.post(
            "api/private/stockx/pricing",
            {
                urlKey:urlKey,
                sizes:sizes
            }
        )
        return pricing.data.data
    }


    const currentStock_init = async (itemForInit=[]) =>{

        function applyPricingData(itemForPriceLoad){
            return new Promise(async (resolve,reject)=>{
                const urlKey = itemForPriceLoad.urlKey

                let sizesForLoad = []
                for(let sizeObj of itemForPriceLoad.sizes){
                    sizesForLoad.push(sizeObj.size)
                }

                const pricingData = await loadItemPricing(sizesForLoad,urlKey)


                if(pricingData.productFound === false){
                    return resolve(itemForPriceLoad)
                }

                for(let info of pricingData.sizesInfo){
                    let targetSizeObj = itemForPriceLoad.sizes.find((sizeObj)=>sizeObj.size === info.size)
                    targetSizeObj.lowestAsk = info.lowestAsk
                    targetSizeObj.highestBid = info.highestBid
                    targetSizeObj.lastSale = info.lastSale
                }
                resolve(itemForPriceLoad)
            })
        }

        try {
            const serverResponse = await axios_default.get(
                "api/private/stock/current"
            )

            if(serverResponse.status !== 200){
                throw Error({
                    message:"server responded with a response that was not 200",
                    serverResponse:serverResponse.status
                })
            }

            let retrievedStock = serverResponse.data

            for(let item of retrievedStock){ //set total qty of item
                item.qty = 0
                for(let sizeObj of item.sizes){
                    item.qty += sizeObj.qty
                }
            }



            let pendingPromises = []

            if(itemsForInit.length === 0){
                for(let item of retrievedStock){
                    pendingPromises.push(applyPricingData(item))
                }
            } else{
                for(let item of retrievedStock){
                    if(itemsForInit.includes(item.urlKey)){
                        pendingPromises.push(applyPricingData(item))
                    }
                }
                setItemsForInit([])
            }



            await Promise.all(pendingPromises)
            setCurrentStock((prevState)=>{
                if(itemsForInit.length === 0){ //if non item particular init
                    return retrievedStock
                }
                let detached_prevState = JSON.parse(JSON.stringify(prevState)) //if item particular init
                for(let urlKey of itemsForInit){
                    const updatedItemData = retrievedStock.find((item)=>item.urlKey === urlKey)
                    let targetItem = detached_prevState.find((item)=>item.urlKey === urlKey)
                    if(targetItem !== undefined){
                        targetItem = retrievedStock.find((item)=>item.urlKey === urlKey)
                    }
                    
                    if(targetItem === undefined){
                        detached_prevState.push(updatedItemData)
                    }
                }
                return detached_prevState
            })
            setCurrentStockIsInitialised(true)
            return 
        } catch(err){
            throw(err)
        }
    }




    return (
        <StockContext.Provider value={{
            currentStock,
            setCurrentStock,
            currentStockIsInitialised,
            currentStock_init,
            setCurrentStockIsInitialised,
            itemsForInit,
            setItemsForInit
        }}>

        {children}

        </StockContext.Provider>
    )
}

export default StockContext