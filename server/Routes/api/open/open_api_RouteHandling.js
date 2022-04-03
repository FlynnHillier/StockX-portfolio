const path = require("path")
const express = require("express")

function build_open_api_router(mongoose_instance,config){

    const open_api_routeHandler = express.Router()

    const NavRoutes = require(path.join(__dirname,"content","NavRoutes"))(mongoose_instance,config)



    open_api_routeHandler
    .use("/NavRoutes",NavRoutes)





    return open_api_routeHandler
}

module.exports = build_open_api_router