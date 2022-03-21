const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")
const { checkSchema , validationResult } = require("express-validator")
const randomstring = require("randomstring")

function build_auth_signup_router(mongoose_instance,config){
    
    function create_user(email,password_plainText,authKey){
        return new Promise((resolve,reject)=>{
            config.mongo.mongoose_models.user.create({
                email:email,
                password:bcrypt.hashSync(password_plainText,config.mongo.user_creation.salt_rounds),
                authKey:authKey,
                stock:{}
            })
            .then((result)=>{
                resolve()
            })
            .catch((error)=>{
                reject( {
                    expected:false,
                    message:"unable to create user",
                    error:error
                })
            })

        })
    }
    
    function gen_authKey(attempt_count=0){
        return new Promise((resolve,rejects)=>{
    
            if(attempt_count >= 4){
                throw {
                    expected:false,
                    message:`after ${attempt_count} attempts to gen a bespoke authKey, a bespoke authKey was still not generated.`
                }
            }
    
            let genned_key = randomstring.generate({
                length:42,
                charset:"alphabetic"
            })
    
            config.mongo.mongoose_models.user.findOne(
                {
                authKey:genned_key
                },
                {
                    authKey:1
                }
            ).then((result)=>{
                if(result === null){
                    resolve(genned_key)
                } else{
                    gen_authKey(attempt_count += 1)
                    .catch((err)=>{
                        rejects(err)
                    }).then((genned_key)=>{
                        resolve(genned_key)
                    })
                }
            })
        })
    }
    
    
    
    //#ROUTE
    
    const auth_signup_router = express.Router()

    auth_signup_router
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

                
                gen_authKey()
                .then((genned_authKey)=>{
                    

                    config.mongo.mongoose_models.user.findOne(
                        {
                            email:req.body.email
                        },
                        {
                            email:1
                        }
                    )
                    .then((found_result)=>{
                        if(found_result === null){
                            create_user(req.body.email,req.body.password,genned_authKey)
                            .then(()=>{


                                req.session.authKey = genned_authKey
                                return res.status(200).send({
                                    result:true,
                                    message:"successfully registered.",
                                    next:undefined,
                                })

                            })
                            .catch((err)=>{
                                next(err)
                            })
                        }

                        if(found_result !== null){
                            return res.status(200).send({
                                result:false,
                                message:"that email is already in use."
                            })
                        }


                    })
                    .catch((error)=>{
                        throw error
                    })



                })
                .catch((error)=>{
                    next(error)
                })



        }
    )


    return auth_signup_router
}





module.exports = build_auth_signup_router