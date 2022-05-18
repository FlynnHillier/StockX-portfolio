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
        async (req,res,next)=>{
            const req_errors = validationResult(req).errors
            if(req_errors.length !== 0){
                next({
                    expected:true,
                    message:req_errors[0].msg
                })
            }

            try {
                const serverResponse = await config.stockx_api.search(req.body.search_query)

                if(serverResponse.result !== true){
                    if(serverResponse.accessDenied === true){
                        return res.status(200).send({
                            result:false,
                            isAccessDenied:true
                        })
                    } else{
                        return res.status(200).send({
                            result:false,
                            isAccessDenied:false,
                        })
                    }
                }

                res.status(200).send({
                    result:true,
                    data:serverResponse.data
                })
            } catch(err){
                next({
                    expected:false,
                    error:err
                })
            }
        }
    )




    return private_api_stockx_search_routeHandler
}

module.exports = build_private_api_stockx_search_router