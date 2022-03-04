const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")



function build_auth_login_router(mongoose_instance,config){

    const auth_login_router = express.Router()



    auth_login_router
    .route("/")
    .post((req,res)=>{
        if(config.request_schema.user(req.body).result === false){
            res.status(403).send({
                message:"bad request"
            })
            

        } else{
            config.mongo.mongoose_models.user.findOne({
                email:req.body.email
            })
            .then((user_info)=>{
                if(user_info === null){ //user not found in database
                    res.status(200).send({
                        result:false,
                        message:"user not found."
                    })
                } else{

                    bcrypt.compare(req.body.password,user_info.password)
                    .then((comparison_result)=>{
                        if(comparison_result === false){
                            res.status(200).send({
                                result:false,
                                message:"passwords did not match."
                            })
                        } 
                        else{
                            req.session.authKey = req.body.email
                            res.status(200).send({
                                result:true,
                                message:"logged in successfully."
                            })
                        }


                    })
                    .catch((error)=>{
                        throw{
                            message:"bcrypt hash comparison failure."
                        }
                    })

                }  


                
            }).catch((error)=>{
                res.status(500).send({
                    expected:true,
                    message:"error contacting database."
                })
            })
        }
    })









    
   
    return auth_login_router
}


module.exports = build_auth_login_router