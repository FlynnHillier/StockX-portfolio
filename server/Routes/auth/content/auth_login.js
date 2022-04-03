const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")
const { checkSchema , validationResult } = require("express-validator")


function build_auth_login_router(mongoose_instance,config){

    const auth_login_router = express.Router()



    auth_login_router
    .route("/")
    .post(
        checkSchema({
            email:config.req_schemas.components.email,
            password:config.req_schemas.components.password            
        }),
        (req,res,next)=>{

            const req_errors = validationResult(req).errors
            if(req_errors.length !== 0){
                return res.status(200).send({
                    result:false,
                    message:req_errors[0].msg
                })
            }


            config.mongo.mongoose_models.user.findOne(
                {
                    email:req.body.email
                },
                {
                    email:1,
                    password:1,
                    authKey:1,
                }
            )
            .then((user_info)=>{
                if(user_info === null){ //user not found in database
                    res.status(200).send({
                        result:false,
                        message:"user not found."
                    })
                }

                if(user_info !== null){
                    bcrypt.compare(req.body.password,user_info.password)
                    .then((comparison_result)=>{
                        if(comparison_result === false){
                            return res.status(200).send({
                                result:false,
                                message:"passwords did not match."
                            })
                        } 
                        else{
                            req.session.authKey = user_info.authKey
                            return res.status(200).send({
                                result:true,
                                message:"logged in successfully."
                            })
                        }

                    })
                    .catch((error)=>{
                        next({
                            expected:false,
                            message:"bcrypt hash comparison failure."
                        })
                    })
                }  
            })
            .catch((error)=>{
                next(error)
            })
        }
    )









    
   
    return auth_login_router
}


module.exports = build_auth_login_router