const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")
const { url } = require("inspector")
const { off } = require("process")

function build_api_private_stock_item_remove(mongoose_instance,config){
    const api_private_stock_item_remove = express.Router()


    async function decrease_user_stock_item_size_qty(authKey,urlKey,size,qty_decrease){
            
            try {
                const result = await config.mongo.mongoose_models.user.findOneAndUpdate(
                    {
                        "authKey":authKey,
                        "stock.current":{
                            "$elemMatch":{
                                urlKey:urlKey
                            }
                        },
                        "stock.current.sizes":{
                            "$elemMatch":{
                                size:size
                            }
                        }
                    },
                    {
                        "$inc":{
                            "stock.current.$[item].sizes.$[size].qty":(-1 * qty_decrease)
                        }
                    },
                    {
                        arrayFilters:[
                            {
                                "item.urlKey":urlKey
                            },
                            {
                                "size.size":size
                            }
                        ],
                        new:true,
                        projection:{
                            "stock.current":true
                        }
                    }
                )

                if(result === null){
                    throw Error({
                        isDidNotExist:true,
                        message:`${urlKey} : ${size} , did not exist for qty decrease.`
                    })
                }

                return result.stock.current

            } catch(err){
                throw err
            }
                
        }



    async function remove_user_stock_item_sizeObj(authKey,urlKey,size){
            try {
                const result = await config.mongo.mongoose_models.user.findOneAndUpdate(
                    {
                        "authKey":authKey,
                        "stock.current":{
                            "$elemMatch":{
                                urlKey:urlKey
                            }
                        },
                        "stock.current.sizes":{
                            "$elemMatch":{
                                size:size
                            }
                        }
                    },
                    {
                        "$pull":{
                            "stock.current.$.sizes":{
                                size:size
                            }
                        }
                    },
                    {
                        projection:{
                            "stock.current":1
                        },
                        new:true,
                    }
                )

                if(result === null){
                    throw Error({
                        isDidNotExist:true,
                        message:`${urlKey} : ${size} , did not exist for sizeObj removal.`
                    })
                } else{
                    return result.stock.current
                }

            } catch(err){
                throw err
            }
        }

    async function remove_user_stock_item(authKey,urlKey){
        try {
            const result = await config.mongo.mongoose_models.user.updateOne(
                {
                    "authKey":authKey,
                    "stock.current":{
                        "$elemMatch":{
                            urlKey:urlKey
                        }
                    },
                },
                {
                    "$pull":{
                        "stock.current":{
                            urlKey:urlKey
                        }
                    }
                }
            )

            if(result === null){
                throw Error({
                    isDidNotExist:true,
                    message:`${urlKey} , item did not exist for item removal.`
                })
            }

            return result
        } catch(err){
            throw err
        }
            
    }





    async function decrease_item_qty(authKey,urlKey,size_qty_arr){

            let didNotExist = []

            for(let sizeObj of size_qty_arr){
                try {
                    const {size,qty} = sizeObj
                    //decrease qty
                    const decQtyResult = await decrease_user_stock_item_size_qty(authKey,urlKey,size,qty)
                    const decQtyResult_targetItem = decQtyResult.find((item)=>item.urlKey === urlKey)
                    const decQtyResult_targetSizeObj = decQtyResult_targetItem.sizes.find((sizeObj)=>sizeObj.size === size)

                    //pull sizeObj
                    if(decQtyResult_targetSizeObj.qty <= 0){
                        const remSizeObjResult = await remove_user_stock_item_sizeObj(authKey,urlKey,size)
                        const remSizeObjResult_targetItem = remSizeObjResult.find((item)=>item.urlKey === urlKey)

                        //pull item
                        if(remSizeObjResult_targetItem.sizes.length === 0){
                            const remItemResult = await remove_user_stock_item(authKey,urlKey)
                        }
                    }
                } catch(err){
                    if(err.isDidNotExist === true){
                        didNotExist.push(err)
                    } else{
                        throw err
                    }
                }

            }
            return didNotExist
    }
    





    api_private_stock_item_remove
    .route("/")
    .post(
        checkSchema({
            updates:{
                isArray:true,
                isEmpty:{
                    negated:true,
                    errorMessage:"updates cannot be empty"
                },
                errorMessage:"invalid"
            },
            "updates.*.urlKey":{
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
            "updates.*.sizes":{
                in:["body"],
                isEmpty:{
                    negated:true,
                    errorMessage:"empty",
                    bail:true,
                },
                isArray:{
                    errorMessage:"not an Array",
                },
                custom:{
                    options:function(sizes_array){
                        if(sizes_array.find((elem)=> typeof elem.size !== "number" || typeof elem.qty !== "number") !== undefined){
                            return false
                        } 

                        if(sizes_array.find((elem)=> elem.size % 0.5 !== 0 || elem.qty % 1 !== 0) !== undefined){
                            return false
                        }  

                        if(sizes_array.find((elem) => elem.qty < 0) !== undefined){
                            return false
                        }

                        return true
                    }   
                },
        
            },
        }),
        async (req,res,next)=>{
            const req_errors = validationResult(req).errors
            
            if(req_errors.length !== 0){
                return next({
                    expected:true,
                    message:`${req_errors[0].msg}, field: ${req_errors[0].param}`
                })
            }



            const authKey = req.session.authKey


            let nonExistantFromUpdate = []

            for (let update of req.body.updates){
                const urlKey = update.urlKey
                const sizesObjArr = update.sizes                
                try {
                    const nonExistant = await decrease_item_qty(authKey,urlKey,sizesObjArr)
                    if(nonExistant !== []){
                        nonExistantFromUpdate.push(nonExistant)
                    }

                } catch(err){
                    return next({
                        expected:false,
                        message:"mongo error removing from user's stock",
                        item:urlKey,
                        error:err
                    })
                }
            }
            res.status(200).send({
                result:true,
                message:"successfully removed item(s) from stock",
                didNotExist:nonExistantFromUpdate
            })
        }    
    )
    


    return api_private_stock_item_remove
}

module.exports = build_api_private_stock_item_remove