const path = require("path")
const express = require("express")

function build_api_private_stock_item_add(mongoose_instance,config){
    const api_private_stock_item_add = express.Router()



    api_private_stock_item_add
    .route("/")
    .post((req,res,next)=>{
        res.status(200).send("hi")
    })
    


    return api_private_stock_item_add
}

module.exports = build_api_private_stock_item_add