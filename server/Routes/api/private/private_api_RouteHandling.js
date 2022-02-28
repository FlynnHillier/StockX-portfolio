const path = require("path")
const express = require("express")

function build_private_api_router(mongoose_instance,config){

    const private_api_routeHandler = express.Router()

    private_api_routeHandler.get("/test",(req,res)=>{
        res.status(200).send("Testing private API")
    })




    return private_api_routeHandler
}

module.exports = build_private_api_router