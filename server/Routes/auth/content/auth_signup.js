const path = require("path")
const express = require("express")



function build_auth_signup_router(mongoose_instance,config){

    const auth_signup_router = express.Router()

    
    auth_signup_router
    .route("/")
    .post((req,res)=>{
        if(!config.request_schema.user(req.body).result){
            res.status(500).send("Sorry invalid request!")
        } else{
            res.status(200).send("u valid!")
        }





    })






    return auth_signup_router
}


module.exports = build_auth_signup_router