const path = require("path")
const express = require("express")

function build_api_private_stockx_router(mongoose_instance,config){
    const api_private_stockx_routeHandler = express.Router()

    const search = require(path.join(__dirname,"content","stockx_search.js"))(mongoose_instance,config)
    const pricing = require(path.join(__dirname,"content","stockx_pricing.js"))(mongoose_instance,config)
    const meta = require(path.join(__dirname,"content","stockx_meta.js"))(mongoose_instance,config)

    api_private_stockx_routeHandler.use("/search",search)
    api_private_stockx_routeHandler.use("/pricing",pricing)
    api_private_stockx_routeHandler.use("/meta",meta)

    return api_private_stockx_routeHandler
}

module.exports = build_api_private_stockx_router