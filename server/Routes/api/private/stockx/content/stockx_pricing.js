const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")


function build_private_api_stockx_search_router(mongoose_instance,config){
    const private_api_stockx_search_routeHandler = express.Router()

    private_api_stockx_search_routeHandler
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
            sizes:{
                in:["body"],
                isEmpty:{
                    negated:true,
                    errorMessage:"empty",
                    bail:true,
                },
                isArray:{
                    errorMessage:"not an Array",
                },
                errorMessage:"invalid",
            }
        }),
        async (req,res,next)=>{

            const req_errors = validationResult(req).errors
            if(req_errors.length !== 0){
                next({
                    expected:true,
                    message:`${req_errors[0].msg}, field: ${req_errors[0].param}`
                })
            }

            try {
                const urlKey = req.body.urlKey
                const sizes = req.body.sizes

                const pricingResponseData = await config.stockx_api.get_product_specific_sizing(sizes,urlKey)
                
                if(pricingResponseData.result === true){
                    res.status(200).send({
                        result:true,
                        data:pricingResponseData.data
                    })
                }

                if(pricingResponseData.result !== true){
                    
                    if(pricingResponseData.accessDenied === true){
                        res.status(200).send({
                            isAccessDenied:true,
                            result:false
                        })
                    } else{
                        throw (`unexpected error retrieving pricing data - ${urlKey}`)
                    }
                    
                }
                
            } catch(err){
                next({
                    expected:false,
                    message:"an undexpected error occured."
                })
            }
        })

    return private_api_stockx_search_routeHandler
}

module.exports = build_private_api_stockx_search_router