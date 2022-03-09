const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")


function build_private_api_stockx_search_router(mongoose_instance,config){
    const private_api_stockx_search_routeHandler = express.Router()

    private_api_stockx_search_routeHandler
    .route("/")
    .post(
        checkSchema({
            search_query:{
                in:["body"],
                trim:true,
                isEmpty:{
                    negated:true,
                    errorMessage:"field empty",
                    bail:true,
                },
                isString:{
                    errorMessage:"not a string",
                },
                errorMessage:"invalid",
            }  
        }),
        (req,res,next)=>{

            const req_errors = validationResult(req).errors
            if(req_errors.length !== 0){
                next({
                    expected:true,
                    message:req_errors[0].msg
                })
            }


            
            
            







        }
    )




    return private_api_stockx_search_routeHandler
}

module.exports = build_private_api_stockx_search_router