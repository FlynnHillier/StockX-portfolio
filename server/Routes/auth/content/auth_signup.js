const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")


function build_auth_signup_router(mongoose_instance,config){

    const auth_signup_router = express.Router()

    
    auth_signup_router
    .route("/")
    .post((req,res)=>{



        if(config.request_schema.user(req.body).result === false){
            res.status(403).send({
                message:"bad request"
            })

        } else{
            
            config.mongo.mongoose_models.user.findOne({
                email:req.body.email
            }).then((result)=>{
                if(result === null){ //user not found in database

                    hash = bcrypt.hashSync(req.body.password,config.mongo.user_creation.salt_rounds)
    
                        config.mongo.mongoose_models.user.create({
                            email:req.body.email,
                            password:hash,
                        }).then((result) => {
                            
                            res.status(200).send({
                                result:true,
                                message:"successfully registered!"
                            })

                        }).catch((error) => {
                            throw {
                                expected:true,
                                message:"error creating user."
                            }
                        })
                } else{
                    res.status(200).send({
                        result:false,
                        message:"that email is already registered."
                    })
                }
            }).catch((error)=>{
                throw {
                    message:"error contacting database."
                }
            })


        }




    })






    return auth_signup_router
}


module.exports = build_auth_signup_router