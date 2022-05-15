const axios = require("axios")
const fs = require('fs')

axios.defaults.headers.common = {
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
        "referer":"https://stockx.com/"
    }

axios.defaults.baseURL = "https://stockx.com/"


const currencyCode = "GBP"
const countryCode = "GB" 

let proxies = {
        lastUsed:0,
        proxyList:proxyInit(`${__dirname}/proxies.txt`)
    }

function proxyInit(proxyFilePath){
    try {
        const x = fs.accessSync(proxyFilePath,fs.constants.R_OK)
    } catch(err){
        throw Error("proxies.txt does not exist, or access has been denied for reading.")
    }


    let proxies = []
    let lineReader = require('readline').createInterface({
        input:fs.createReadStream(proxyFilePath)
    });

    lineReader.on('line', function (line) {
        let proxyInfo = line.split(":")
        if(proxyInfo.length !== 4){
            throw Error(
                `Proxy provided was not in format 'host:port:username:password'. \n failed on: '${line}'`
            )
        } else{
            proxies.push(proxyInfo)
        }
    });


    return proxies
}



function proxyRotate(){
    if(proxies.proxyList.length === 0){
        return
    }

    const lastUsedIndex = proxies.lastUsed
    const proxyList = proxies.proxyList

    const targetIndex = lastUsedIndex === proxyList.length - 1 ? 0 : lastUsedIndex + 1
    
    const proxyForUse = proxyList[targetIndex]

    axios.defaults.proxy = {
        host: proxyForUse[0],
        port: proxyForUse[1],
        auth:{
            username:proxyForUse[2],
            password:proxyForUse[3]
        }
    }

    proxies.lastUsed = targetIndex
    console.log(proxyForUse)
}




function search_item(search_term,max_results=4){
    proxyRotate()
    return new Promise((resolves,rejects)=>{

        if(!Number.isInteger(max_results)){
            throw 'max_results must be an integer'
        }

        axios.get(
            "/api/browse",
            {
                params:{
                    currency: currencyCode,
                    _search: search_term,
                    dataType: "product",
                }
            }
        )
        .then((result)=>{
            if(result.status !== 200){
                rejects({
                    reason:"status code incorrect"
                })
            }


            const products = result.data.Products


            let upperBound = -1
            if(max_results < products.length){
                upperBound = max_results
            } else{
                upperBound = products.length
            }

            let response = []

            for(let i = 0; i < upperBound;i++){
                let product = products[i]



                response.push({
                    title:product.title,
                    type:product.shoe,
                    colorway:product.traits.find((trait)=> trait.name === "Colorway" || trait.name === "Color").value,
                    urlKey:product.urlKey,
                    releaseDate:product.traits.find((trait)=>trait.name === "Release Date").value,
                    media:product.media
                })
            }
            
            resolves(response)

        })
        .catch((error)=>{
            rejects({
                reason:"axios failure",
                error:error
            })
        })

    })
}




function get_product_info(product_urlKey){
    proxyRotate()
    return new Promise((resolves,rejects)=>{
        axios({
            url:"/p/e",
            method:"post",
            data:{
                    operationName: "GetProduct",
                    query:"query GetProduct($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String) { product(id: $id) { id listingType urlKey media { imageUrl } ...LastSale_Bid_Ask ...ProductSchemaFragment } } fragment LastSale_Bid_Ask on Product { variants { id traits { size } market(currencyCode: $currencyCode) { bidAskData(country: $countryCode, market: $marketName) { highestBid lowestAsk } salesInformation { volatility lastSale changeValue changePercentage } } } }  fragment ProductSchemaFragment on Product { id urlKey productCategory brand model title description condition styleId media { thumbUrl imageUrl __typename } market(currencyCode: $currencyCode) { bidAskData(country: $countryCode, market: $marketName) { lowestAsk numberOfAsks __typename } __typename } variants { id hidden traits { size __typename } market(currencyCode: $currencyCode) { bidAskData(country: $countryCode, market: $marketName) { lowestAsk __typename } __typename } __typename } __typename}",
                    //query:"query GetProduct($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String) {  product(id: $id) { id listingType urlKey media { imageUrl } ...LastSale_Bid_Ask } } fragment LastSale_Bid_Ask on Product { variants { id traits { size } market(currencyCode: $currencyCode) { bidAskData(country: $countryCode, market: $marketName) { highestBid lowestAsk } salesInformation { volatility lastSale changeValue changePercentage } } } }",
                    variables:{
                        countryCode: countryCode,
                        currencyCode: currencyCode,
                        id: product_urlKey
                    }
            },
            headers:{
                    "apollographql-client-name": "Iron",
                    "apollographql-client-version": "2022.02.27.01",
            }
        })
        .then((result)=>{
            if(result.status !== 200){
                rejects({
                    reason:"status code incorrect"
                })
            }

            resolves(result.data.data.product)
        })
        .catch((error)=>{
            rejects({
                error:error,
                reason:"axios failure"
            })
        })
    })
}


function get_product_specific_sizing(sizes=[],urlKey){
    proxyRotate()
    return new Promise((resolves,rejects)=>{
        
        for(let size of sizes){
            if(Number.isNaN(size)){
                throw 'size must be an valid number'
            } else{
                if(size % 0.5 !== 0){
                    throw 'size must be an valid multiple of 0.5 (full size / half size)'
                }
            }
        }
        
        
        get_product_info(urlKey)
        .then((data)=>{

            if(data === null || data === undefined){
               resolves({
                productFound:false,
               })
            }
            
            let response = {
                productFound:true,
                imageURL:data.media.imageUrl,
                listingType:data.listingType,
                productCategory: data.productCategory,
                brand: data.brand,
                model: data.model,
                title: data.title,
                sizesInfo:[]
            }

            for(let size of sizes){

                let size_info = data.variants.find((variant) => variant.traits.size == size)
                
                if(size_info === undefined){
                    response.sizesInfo.push({
                        size:size,
                        exists:false
                    })
                }
                else{
                    response.sizesInfo.push({
                        size:size,
                        exists:true,
                        id:size_info.id,
                        lowestAsk:size_info.market.bidAskData.lowestAsk,
                        highestBid:size_info.market.bidAskData.highestBid,
                        lastSale:size_info.market.salesInformation.lastSale,
                        lastSale_changePercentage:size_info.market.salesInformation.changePercentage,
                        lastSale_changeValue:size_info.market.salesInformation.changeValue,
                        salesVolatility:size_info.market.salesInformation.volatility
                    })
                }
            }
            resolves(response)
        })
        .catch((error)=>{
            rejects((error))
        })
    })
}


function get_product_metaInfo(product_urlKey){
    proxyRotate()
    return new Promise((resolves,rejects)=>{
        axios({
            url:"/p/e",
            method:"post",
            data:{
                    operationName: "GetProduct",
                    query:"query GetProduct($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String) { product(id: $id) { id listingType urlKey media { imageUrl } ...ProductSchemaFragment ...ProductDetailsFragment } }  fragment ProductDetailsFragment on Product { traits { name value } } fragment ProductSchemaFragment on Product { id urlKey productCategory brand model title condition styleId media { thumbUrl imageUrl __typename } market(currencyCode: $currencyCode) { bidAskData(country: $countryCode, market: $marketName) { numberOfBids numberOfAsks } __typename } variants { hidden traits { size } } }",
                    variables:{
                        countryCode: countryCode,
                        currencyCode: currencyCode,
                        id: product_urlKey
                    }
            },
            headers:{
                    "apollographql-client-name": "Iron",
                    "apollographql-client-version": "2022.02.27.01",
            }
        })
        .then((result)=>{
            if(result.status !== 200){
                rejects({
                    reason:"status code incorrect"
                })
            }

            resolves(result.data.data.product)
        })
        .catch((error)=>{
            rejects({
                error:error,
                reason:"axios failure"
            })
        })
    })
}




//**TESTING**

// search_item("mummy dunk").then((result)=>{

//     get_product_specific_sizing([7,9,20],result[0].urlKey)
//     .then((data)=>{
//         console.log(data)
//     })
//     .catch((error)=>{
//         console.error(error)
//     })
//     console.log(result)
// })
// .catch((err)=>{
//     console.error(err)
// })



// get_product_specific_sizing([7,9,20],"air-jordan-6-retro-unc-white")
// .then((data)=>{
//     console.log(data)
// })
// .catch((error)=>{
//     console.error(error)
// })






module.exports = {
    search:search_item,
    get_product_info:get_product_info,
    get_product_specific_sizing:get_product_specific_sizing,
    get_product_metaInfo:get_product_metaInfo,
}