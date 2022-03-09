const axios = require("axios")

axios.defaults.headers.common = {
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    }

axios.defaults.baseURL = "https://stockx.com/api/"

const currency = "GBP"





function search_item(search_term,max_results=4){
    return new Promise((resolves,rejects)=>{

        if(!Number.isInteger(max_results)){
            throw 'max_results must be an integer'
        }

        axios.get(
            "/browse",
            {
                params:{
                    currency: currency,
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
                    releaseDate:product.traits.find((trait)=>trait.name === "Release Date").value
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




// search_item("yeezy 500",6)
// .then((response)=>{
//     console.log(response)
// })
// .catch((error)=>{
//     console.error(error)
// })


module.exports = {
    search:search_item
}