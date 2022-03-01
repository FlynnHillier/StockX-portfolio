const path = require("path")
const express = require("express")
const sessions = require("express-session")
const bodyparser = require("body-parser")


function route_handling(app,mongoose_instance,config){

    app.use(bodyparser.urlencoded({ extended: true }))
    app.use(bodyparser.json())
    app.use(sessions(config.sessions))


    const api = require(path.join(config.directories.routes,"api","api_RouteHandling.js"))(mongoose_instance,config)
    const auth = require(path.join(config.directories.routes,"auth","auth_RouteHandling.js"))(mongoose_instance,config)


    app.use("/api",api)
    app.use("/auth",auth)
    
    app.use(express.static(config.directories.static))

    app.use("*",(req,res)=>{
        res.status(404).send("The requested resource was not found.")
    })


    app.use((err,req,res,next)=>{
        
        if(err.message){
            res.status(500).send({
                error:true,
                message:err.message
            })
        } else{
            res.status(500).send({
                error:true,
                message:"an unprecidented error occured."
            })
            console.log(`**UNPRECIDENTED ERROR** : \n ${err}`)
        }
    })
}

module.exports = route_handling