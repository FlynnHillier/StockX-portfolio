import { createContext,useEffect,useState } from "react";

import axios_default from "./../api/axios";
import axios from "axios";



const StockContext = createContext({})

export const StockProvider = ({children}) => {

    let [currentStock,setCurrentStock] = useState([])
    let [currentStockIsInitialised,setCurrentStockIsInitialised] = useState(false)





    const currentStock_init = async () =>{

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
            for(let itemForPriceLoad of retrievedStock){
                pendingPromises.push(applyPricingData(itemForPriceLoad))
            }

            await Promise.all(pendingPromises)
            setCurrentStock(retrievedStock)
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
            setCurrentStockIsInitialised
        }}>

        {children}

        </StockContext.Provider>
    )
}

export default StockContext