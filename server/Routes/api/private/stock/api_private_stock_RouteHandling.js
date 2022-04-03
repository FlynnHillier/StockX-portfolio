const path = require("path")
const express = require("express")

function build_api_private_stock_router(mongoose_instance,config){
    const api_private_stock_routeHandler = express.Router()

    const item = require(path.join(__dirname,"item","api_private_stock_item_RouteHandling"))(mongoose_instance,config)

    api_private_stock_routeHandler
    .use("/item",item)


    return api_private_stock_routeHandler
}

module.exports = build_api_private_stock_router