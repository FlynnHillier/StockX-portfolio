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
                    errorMessage:"empty query",
                    bail:true,
                },
                isString:{
                    errorMessage:"query must be a string",
                },
                errorMessage:"invalid query",
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

            config.stockx_api.search(req.body.search_query)
            .then((response)=>{
                res.status(200).send({
                    data:response
                })
            })
            .catch((error)=>{
                next({
                    expected:false,
                    error:error
                })
            })
        }
    )




    return private_api_stockx_search_routeHandler
}

module.exports = build_private_api_stockx_search_router