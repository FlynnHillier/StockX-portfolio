const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")
const { checkSchema , validationResult } = require("express-validator")


function build_auth_signup_router(mongoose_instance,config){

    const auth_signup_router = express.Router()

    
    auth_signup_router
    .route("/")
    .post(
            checkSchema({
            email:{
                in:["body"],
                trim:true,
                isEmpty:{
                    negated:true,
                    errorMessage:"email field empty",
                    bail:true,
                },
                isEmail:{
                    errorMessage:"not a valid email",
                    bail:true,
                },

                errorMessage:"invalid email",
            },
            password:{
                trim:true,
                isEmpty:{
                    negated:true,
                    errorMessage:"password field empty",
                    bail:true,
                },
                isString:true,
                isLength:{
                    errorMessage:"password must be atleast 5 characters long",
                    options:{min:5},
                    bail:true,
                },
            }
        }),

        (req,res)=>{


            console.log(validationResult(req))

            config.mongo.mongoose_models.user.create({
                email:"plonk",
                password:"password",
                authKey:"auth_testt"
            })
            .then((result)=>{
                console.log("success")

                console.log(result)

                res.status(200).send({

                    ee:result,
                    result:true,
                    message:"success?"
                })


            })
            .catch((err)=>{

                // console.log(err)

                console.log("user field creation error")

                res.status(200).send({
                    result:false,
                    message:"error",
                    error:err

                })

            })
        }
    )


    return auth_signup_router
}

module.exports = build_auth_signup_router