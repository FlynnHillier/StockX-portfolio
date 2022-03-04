const path = require("path")
const express = require("express")

function build_private_api_router(mongoose_instance,config){

    const private_api_routeHandler = express.Router()

    private_api_routeHandler.use((req,res,next)=>{
        if(req.session.authKey === undefined){
            next({
                expected:true,
                message:"you do not have access to this resource"
            })
        } else{
            next()
        }


    })


    private_api_routeHandler.get("/test",(req,res)=>{
        res.status(200).send("Testing private API")
    })








    return private_api_routeHandler
}

module.exports = build_private_api_router