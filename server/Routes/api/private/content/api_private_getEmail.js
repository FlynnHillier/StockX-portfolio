const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")


function build_api_private_getEmail_router(mongoose_instance,config){

    const api_private_getEmail_router = express.Router()

    api_private_getEmail_router
    .route("/")
    .post((req,res,next)=>{
        config.mongo.mongoose_models.user.findOne(
            {
                authKey:req.session.authKey
            },
            {
                email:1
            }
        )
        .then((user_info)=>{
            res.status(200).send({
                result:true,
                data:user_info.email
            })
        })
        .catch((error)=>{
            next(error)
        })
    })









    
   
    return api_private_getEmail_router
}


module.exports = build_api_private_getEmail_router