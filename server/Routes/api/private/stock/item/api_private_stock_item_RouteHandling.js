const path = require("path")
const express = require("express")

function build_api_private_stock_item_router(mongoose_instance,config){
    const api_private_stock_item_routeHandler = express.Router()

    const add = require(path.join(__dirname,"content","item_add"))(mongoose_instance,config)
    const test = require(path.join(__dirname,"content","test"))(mongoose_instance,config)


    api_private_stock_item_routeHandler
    .use("/add",add)
    .use("/test",test)
    


    return api_private_stock_item_routeHandler
}

module.exports = build_api_private_stock_item_router