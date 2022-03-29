const path = require("path")
const express = require("express")

function build_open_api_navBarContent(mongoose_instance,config){

    const open_api_navBarContentr = express.Router()
    
    open_api_navBarContentr
    .route("/")
    .get(
        (req,res)=>{
            res.status(200).send(config.frontend_resources.nav_routes)
        }
    )





    return open_api_navBarContentr
}

module.exports = build_open_api_navBarContent