const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")


function build_private_api_stockx_metea_router(mongoose_instance,config){
    const private_api_stockx_meta_routeHandler = express.Router()

    private_api_stockx_meta_routeHandler
    .route("/")
    .post(
        checkSchema({
            urlKey:{
                in:["body"],
                trim:true,
                isEmpty:{
                    negated:true,
                    errorMessage:"empty",
                    bail:true,
                },
                isString:{
                    errorMessage:"not a string",
                },
                errorMessage:"invalid",
            },
        }),
        (req,res,next)=>{

            const req_errors = validationResult(req).errors
            if(req_errors.length !== 0){
                next({
                    expected:true,
                    message:`${req_errors[0].msg}, field: ${req_errors[0].param}`
                })
            }

            config.stockx_api.get_product_metaInfo(req.body.urlKey)
            .then((response)=>{
                res.status(200).send({
                    result:true,
                    data:response
                })
            })
            .catch((error)=>{
                if(error.isAccessDenied === true){
                    return res.status(200).send({
                        result:false,
                        isAccessDenied:true
                    })
                }
                next({
                    expected:false,
                    error:error
                })
            })
        }
    )




    return private_api_stockx_meta_routeHandler
}

module.exports = build_private_api_stockx_metea_router