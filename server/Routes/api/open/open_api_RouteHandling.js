const path = require("path")
const express = require("express")

function build_open_api_router(mongoose_instance,config){

    const open_api_routeHandler = express.Router()

    open_api_routeHandler
    .get("/test",(req,res)=>{
        res.status(200).send("Testing open API")
    })





    return open_api_routeHandler
}

module.exports = build_open_api_router