const path = require("path")
const express = require("express")

function build_api_router(mongoose_instance,config){

    const api_router = express.Router()




    api_router.get("/hello",(req,res)=>{
        res.status(200).send("hello!")
    })


    console.log("hiiiii")



    return api_router
}

module.exports = build_api_router