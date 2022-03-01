const path = require("path")
const express = require("express")

const content_dir = path.join(__dirname,"content")


function build_auth_router(mongoose_instance,config){

    const auth_router = express.Router()



    const login = require(path.join(content_dir,"login"))(mongoose_instance,config)
    const signup = require(path.join(content_dir,"signup"))(mongoose_instance,config)



    auth_router.use("/login",login)
    auth_router.use("/signup",signup)


    return auth_router
}


module.exports = build_auth_router