import { createContext,useEffect,useState } from "react";

import axios_default from "./../api/axios";
import axios from "axios";



const StockContext = createContext({})

export const StockProvider = ({children}) => {


    const maxRetrys = 5

    let [currentStock,setCurrentStock] = useState([])
    let [currentStockIsInitialised,setCurrentStockIsInitialised] = useState(false)
    let [errorMessage,setErrorMessage] = useState("")

    const currentStock_init = async () =>{

        async function loadItemPricing(sizes,urlKey){     
            try {
                const pricingServerResponse = await axios_default.post(
                    "api/private/stockx/pricing",
                    {
                        urlKey:urlKey,
                        sizes:sizes
                    }
                )
                
                if(pricingServerResponse.data.result === false){
                    throw {
                        isAccessDeniedError:pricingServerResponse.data.isAccessDenied
                    }
                }

                return pricingServerResponse.data.data
            } catch(err){
                throw(err)
            }
        }

        function applyPricingData(itemForPriceLoad,retryNum=0){
            return new Promise(async (resolve,reject)=>{
                try {
                    const urlKey = itemForPriceLoad.urlKey

                    let sizesForLoad = []
                    for(let sizeObj of itemForPriceLoad.sizes){
                        sizesForLoad.push(sizeObj.size)
                    }

                    const pricingData = await loadItemPricing(sizesForLoad,urlKey)

                    itemForPriceLoad.isLoaded = true

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
                } catch (err){
                    if(err.isAccessDeniedError){
                        itemForPriceLoad.isLoaded = false
                        
                        if(!(retryNum > maxRetrys)){
                            applyPricingData(itemForPriceLoad,retryNum + 1)
                            .then((updatedItem)=>{
                                resolve(updatedItem)
                            })
                            .catch((err)=>{
                                reject (err)
                            })
                        } else{
                            return reject({
                                message:`after ${maxRetrys} attempt(s) to retrieve pricing info for item: '${itemForPriceLoad.urlKey}', prices were stil not retrieved. Stopping.`
                            })
                        }
                    } else{
                        reject(err)
                    }
                }
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
            for(let itemForPriceLoad of retrievedStock){
                pendingPromises.push(applyPricingData(itemForPriceLoad))
            }

            await Promise.all(pendingPromises)
            setCurrentStock(retrievedStock)
            setCurrentStockIsInitialised(true)
            return 
        } catch(err){
            setErrorMessage(`a critical error has occured while attempting to load your stock: Please refresh. Error details: ${err.message ? err.message : "non provided."}`)
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
            errorMessage
        }}>

        {children}

        </StockContext.Provider>
    )
}

export default StockContext