import { createContext,useEffect,useState } from "react";

import axios from "./../api/axios"




const StockContext = createContext({})

export const StockProvider = ({children}) => {

    let [currentStock,setCurrentStock] = useState([])
    let [currentStockIsLoaded,setCurrentStockIsLoaded] = useState(false)
    let [currentStockPricesLoaded,setCurrentStockPricesLoaded] = useState(false)



    const currentStock_load = () => {
        return new Promise(async(resolve,reject)=>{
            let serverResponse

            if(currentStockIsLoaded === false){
                serverResponse = await axios.get(
                    "api/private/stock/current"
                )

                if(serverResponse.status !== 200){
                    reject({
                        message:"server responded with a response that was not 200",
                        serverResponse:serverResponse.status
                    })
                }
            }
            
            
            let retrievedCurrentStock = serverResponse.data

            for(let item of retrievedCurrentStock){ //set total qty of item
                item.qty = 0

                for(let sizeObj of item.sizes){
                    item.qty += sizeObj.qty
                }

            }

            setCurrentStock(currentStockIsLoaded ? currentStock : retrievedCurrentStock)
            setCurrentStockIsLoaded(true)

            resolve()
        })
    }




    const currentStock_loadPricingData = (urlKeysToLoad=[]) => { //itemsToLoad array of url-keys to load pricings
        return new Promise((resolve,reject)=>{

            if(Array.isArray(urlKeysToLoad) === false){

                return reject({
                    message:"passed array must contain soley urlKey's that are currently present within currentStock"
                })
            } 
            

            let itemsToLoad = []

            for(let urlKeyForLoad of urlKeysToLoad){
                const matchingItem = currentStock.find((currentItem)=>currentItem.urlKey === urlKeyForLoad)
                if(matchingItem === undefined){


                    return reject({
                        message:"urlKey provided for pricing data retrieval did not exist within user's currentStock context",
                        currentStockObject:currentStock,
                        urlKey:urlKeyForLoad
                    })
                }

                if(matchingItem !== undefined){
                    itemsToLoad.push(matchingItem)
                }
            }


            if(urlKeysToLoad.length === 0){//load pricing for all items in currentStock
                itemsToLoad = currentStock
            }

            let pendingPromises = []
            let errors = []



            for(let itemForLoad of itemsToLoad){


                pendingPromises.push(
                    new Promise(async (resolve,reject)=>{

                        let sizes = []
                        for(let sizeObj of itemForLoad.sizes){
                            sizes.push(sizeObj.size)
                        }

                        const serverResponse = await axios.post(
                            "api/private/stockx/pricing",
                            {
                                urlKey:itemForLoad.urlKey,
                                sizes:sizes
                            }
                        ).catch((error)=>{
                            reject(error)
                        })
                        

                        const data = serverResponse.data.data

                        resolve(data)
                    })
                    .then((resolutionData)=>{




                        setCurrentStock((stock)=>{

                            const targetItemInStock = stock.find((itemInStock)=>itemInStock.urlKey === itemForLoad.urlKey)

                            if(resolutionData.productFound === false){
                                targetItemInStock.exists = false
                            }

                            if(resolutionData.productFound === true){
                                targetItemInStock.exists = true


                                for(let info of resolutionData.sizesInfo){
                                    const targetSizeObj = targetItemInStock.sizes.find((sizeObj)=>sizeObj.size === info.size)
                                    targetSizeObj.lowestAsk = info.lowestAsk
                                    targetSizeObj.highestBid = info.highestBid
                                    targetSizeObj.lastSale = info.lastSale
                                }

                            }

                            return stock
                        })


                    })
                    .catch((err)=>{
                        errors.push(
                            {
                                message:"error loading item pricing info",
                                item:itemForLoad,
                                error:err
                            }
                        )
                        reject()
                    })
                )

            }


            Promise.all(pendingPromises)
            .then((_)=>{
                resolve()
                setCurrentStockPricesLoaded(true)
            })
            .catch((_)=>{
                reject(
                    {
                        message:"error loading one or more items pricing Info",
                        errors:errors
                    }
                )
            })


        })
    }





    const currentStock_addItems = async(items) => { //items to follow array schema of backend 'item' routes
        
        const serverResponse = await axios.post(
            "api/private/stock/item/add",
            {
                updates:items
            }
        )



        if(serverResponse.data.result !== true){
            throw Error({
                    message:"unexpected server response",
                    sentData:{
                        updates:items
                    },
                    serverResponse:serverResponse.data
                })
        }

        if(serverResponse.data.result === true) {

            for(let item of items){

                setCurrentStock((stock)=>{
                    const existingItem = stock.find((existingItem)=>existingItem.urlKey === item.urlKey)
                    
                    const itemExists = !(existingItem === undefined)

                    if(itemExists === true){
                        
                        for(let sizeObj of existingItem.sizes){

                            const size = sizeObj.size
                            const qtyForInc = sizeObj.qty

                            const existingItemSizeObj = existingItem.sizes.find((existingSizeObj)=>existingSizeObj.size === size)
                            const sizeObjExists =  !(existingItemSizeObj === undefined)

                            if(sizeObjExists === true){
                                existingItemSizeObj.qty += qtyForInc
                            }

                            if(sizeObjExists === false){
                                existingItem.sizes.push(
                                    {
                                        size:size,
                                        qty:qtyForInc
                                    }
                                )
                            }

                        }

                    }

                    if(itemExists === false){
                        stock.push(item)
                    }
                })
            }
        }
    }




    return (
        <StockContext.Provider value={{
            currentStock,
            currentStockIsLoaded,
            currentStock_load,
            currentStock_loadPricingData,
            currentStockPricesLoaded,
        }}>

        {children}

        </StockContext.Provider>
    )
}

export default StockContext