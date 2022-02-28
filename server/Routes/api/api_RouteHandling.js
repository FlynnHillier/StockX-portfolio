const path = require("path")
const express = require("express")
const sessions = require("express-session")

function build_api_router(mongoose_instance,config){

    const api_routeHandler = express.Router()

    const open_api_routeHandler = require(path.join(__dirname,"open","open_api_RouteHandling.js"))(mongoose_instance,config)
    const private_api_routeHandler = require(path.join(__dirname,"private","private_api_RouteHandling.js"))(mongoose_instance,config)




    api_routeHandler.use(sessions(config.sessions))



    api_routeHandler.use("/private",private_api_routeHandler)
    api_routeHandler.use("/",open_api_routeHandler)




    return api_routeHandler
}

module.exports = build_api_router