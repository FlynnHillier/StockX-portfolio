const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")

function build_api_private_stock_item_remove(mongoose_instance,config){
    const api_private_stock_item_remove = express.Router()


    function decrease_user_stock_item_size_qty(authKey,urlKey,size,qty_decrease){
        return new Promise((resolve,reject)=>{
            config.mongo.mongoose_models.user.findOneAndUpdate(
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
                        "stock.current.$[item].sizes.$[size].qty":-qty_decrease
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
                        "stock.current":1
                    }
                }
            )
            .then((result)=>{
                resolve(result)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    }



    function remove_user_stock_item_sizeObj(authKey,urlKey,size){
        return new Promise((resolve,reject)=>{
            config.mongo.mongoose_models.user.findOneAndUpdate(
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
            .then((result)=>{
                resolve(result)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    }

    function remove_user_stock_item(authKey,urlKey){
        return new Promise((resolve,reject)=>{
            config.mongo.mongoose_models.user.updateOne(
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
            .then((result)=>{
                resolve(result)
            })
            .catch((error)=>{
                reject(error)
            })
        })
    }





    function decrease_item_qty(authKey,urlKey,size_qty_arr){
        return new Promise((resolve,reject)=>{

            for(let size_obj of size_qty_arr){

                decrease_user_stock_item_size_qty(authKey,urlKey,size_obj.size,size_obj.qty)
                .then((result)=>{



                    if(result.stock.current.find((item)=> item.urlKey === urlKey).sizes.find((mongo_side_size_obj)=>mongo_side_size_obj.size === size_obj.size).qty <= 0){
                        remove_user_stock_item_sizeObj(authKey,urlKey,size_obj.size)
                        .then((result)=>{

                            if(result.stock.current.find((item)=> item.urlKey === urlKey).sizes.length === 0){
                                remove_user_stock_item(authKey,urlKey)
                                .then((result)=>{
                                    resolve() //shouldn't really happen unless last itteration of for loop ( if it does means non existant sizes were passed)
                                })
                                .catch((error)=>{
                                    reject({
                                        expected:false,
                                        message:"mongo error removing an item from users stock",
                                        error:error
                                    })
                                })
                            }

                        })
                        .catch((error)=>{
                            reject({
                                expected:false,
                                message:"mongo error removing an item's sizeObj from users stock",
                                error:error
                            })
                        })
                    }
                })
                .catch((error)=>{
                    reject({
                        exected:false,
                        message:"mongo error decreasing qty of user's item size",
                        error:error
                    })
                })


            }

            resolve()

        })
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
        (req,res,next)=>{
            const req_errors = validationResult(req).errors
            
            if(req_errors.length !== 0){
                return next({
                    expected:true,
                    message:`${req_errors[0].msg}, field: ${req_errors[0].param}`
                })
            }


            
            let promises = []
            for (let update of req.body.updates){                
                promises.push(decrease_item_qty(req.session.authKey,update.urlKey,update.sizes))

            }
            
            Promise.all(promises)
            .then((_)=>{
                res.status(200).send({
                    result:true,
                    message:"Successfully removed item(s) from user's stock"
                })
            })
            .catch((error)=>{
                next({
                    expected:false,
                    message:"mongo error removing from user's stock",
                    error:error
                })
            })

            





        }    
    )
    


    return api_private_stock_item_remove
}

module.exports = build_api_private_stock_item_remove