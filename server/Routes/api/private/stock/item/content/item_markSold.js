const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")
const req = require("express/lib/request")
const { resolve } = require("path")

function build_api_private_stock_item_markSold(mongoose_instance,config){
    const api_private_stock_item_markSold = express.Router()

    
    function add_new_item_to_user(authKey,urlKey,title,imageURL,colour){
        return new Promise((resolve,reject)=>{
        
            config.mongo.mongoose_models.user.updateOne(
                {
                    authKey:authKey,
                    "stock.sold":{
                        "$not":{
                            "$elemMatch":{
                                urlKey:urlKey
                            }
                        }
                    }
                },
                {
                    "$addToSet":{
                        "stock.sold":{
                            urlKey:urlKey,
                            sizes:[],
                            title:title,
                            imgURL:imageURL,
                            colour:colour
                        }
                    }
                }
            )
            .then((result)=>{
                resolve(result)
            })
            .catch((error)=>{
                reject({
                    expected:false,
                    message:"mongo error adding item to user's stock array",
                    error:error
                })
            })
        })
    }


    function add_new_size_to_item(authKey,urlKey,size){
        return new Promise((resolve,reject)=>{

            config.mongo.mongoose_models.user.updateOne(
                {
                    authKey:authKey,
                    "stock.sold":{
                        "$elemMatch":{
                            urlKey:urlKey,
                            sizes:{
                                "$not":{
                                    "$elemMatch":{
                                        size:size
                                    }
                                }
                            }
                        },
                    }
                },
                {
                    "$addToSet":{
                        "stock.sold.$.sizes":{
                            "size":size,
                            "quantity":0,
                        }
                    }
                }
            )
            .then((result)=>{
                resolve(result)
            })
            .catch((error)=>{
                reject({
                    expected:false,
                    message:"error adding new size to an item in user array",
                    error:error
                })
            })

        })
    }


    function inc_item_size_qty(authKey,urlKey,size,qty){
        return new Promise((resolve,reject)=>{

            config.mongo.mongoose_models.user.updateOne(
                {
                    authKey:authKey
                },
                {
                    "$inc":{
                        "stock.sold.$[item].sizes.$[size].qty":qty
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
                    ]
                }
            )
            .then((result)=>{
                resolve(result)
            })
            .catch((error)=>{
                reject({
                    expected:false,
                    message:"error incrementing a user's item's qty field",
                })
            })
        })
    }




    function add_item(authKey,urlKey,size_qty_arr,title,imageURL,colour){
        return new Promise((resolve,reject)=>{

           add_new_item_to_user(authKey,urlKey,title,imageURL,colour)
           .then((result)=>{

                for(let size_info_obj of size_qty_arr){
                    add_new_size_to_item(authKey,urlKey,size_info_obj.size)
                    .then((result)=>{
                        if(size_info_obj.qty !== 0){
                            inc_item_size_qty(authKey,urlKey,size_info_obj.size,size_info_obj.qty)
                            .catch((error)=>{
                                reject(error)
                            })
                        }

                    })
                    .catch((error)=>{
                        reject(error)
                    })
                }
                resolve()
           })
           .catch((error)=>{
               reject(error)
           })

        })
    }











    function current_stock_decrease_AIO(authKey,urlKey,size,qty_for_dec){
        return new Promise((resolve,reject)=>{

            //**Decrement size qty **//
            config.mongo.mongoose_models.user.findOneAndUpdate(
                {//query
                    authKey:authKey,
                    "stock.current":{
                        "$elemMatch":{
                            urlKey:urlKey,
                            "sizes":{
                                "$elemMatch":{
                                    size:size
                                }
                            }
                        }
                    }
                },
                {//update
                    "$inc":{
                        "stock.current.$[item].sizes.$[sizeObj].qty":-qty_for_dec
                    }
                },
                {//config
                    arrayFilters:[
                        {
                            "item.urlKey":urlKey
                        },
                        {
                            "sizeObj.size":size
                        }
                    ],
                    new:true
                }
            )
            .then((updated_document)=>{//_qty decreased

                if(updated_document === null){
                    //item does not exist or size within item does not exist to be decremented.

                    resolve(
                        {
                            result:false,
                            affected_item_details:undefined,
                            details:{
                                item_removed:false,
                                size_obj_removed:false,
                                qty_val_decreased:false,
                                was_decrease_overflow: undefined,
                                decrease_overflow_val: undefined
                            },
                            message:"provided item / item size did not exist within user's current stock"
                        }
                    )

                }

                let item = updated_document.stock.current.find((item)=>item.urlKey === urlKey)
                let size_obj = item.sizes.find((size_obj)=>size_obj.size === size)

                if(size_obj.qty <= 0){


                    new Promise((resolve,reject)=>{

                        if(item.sizes.length === 1){

                            //**Remove item **/
                            config.mongo.mongoose_models.user.findOneAndUpdate(
                                {//query
                                    authKey:authKey,
                                    "stock.current":{
                                        "$elemMatch":{
                                            urlKey:urlKey,
                                        }
                                    }
                                },
                                {//update
                                    "$pull":{
                                        "stock.current":{
                                            urlKey:urlKey
                                        }
                                    }
                                },
                                {//config
                                    new:true
                                }
                            )
                            .then((updated_document)=>{
                                //_item deleted from stock.current arr
                                if(updated_document !== null){
                                    resolve(
                                        {
                                            result:true,
                                            item_removed:true,
                                            size_obj_removed:false,
                                            qty_decreased:false,
                                        }
                                    )
                                }
                                if(updated_document === null){
                                    resolve(
                                        {
                                            result:false,
                                            message:"document could not be located for update"
                                        }
                                    )
                                }
                            })
                            .catch((error)=>{
                                reject(error)
                            })
                        }

                        if(item.sizes.length !== 1){
                            //**Delete size from item arr**//
                            config.mongo.mongoose_models.user.findOneAndUpdate(
                                {//query
                                    authKey:authKey,
                                    "stock.current":{
                                        "$elemMatch":{
                                            urlKey:urlKey,
                                        }
                                    }
                                },
                                {//update
                                    "$pull":{
                                        "stock.current.$.sizes":{
                                            size:size
                                        }
                                    }
                                },
                                {//config
                                    new:true
                                }
                            )
                            .then((updated_document)=>{
                                //_size deleted from sizes arr
                                if(updated_document !== null){

                                    resolve(
                                        {
                                            result:true,
                                            item_removed:false,
                                            size_obj_removed:true,
                                            qty_decreased:false,
                                        }
                                    )
                                }
                                
                                if(updated_document === null){
                                    resolve(
                                        {
                                            result:false,
                                            message:"document could not be located for update"
                                        }
                                    )
                                }
                            })
                            .catch((error)=>{
                                reject(error)
                            })
                        }

                    })
                    .then((removal_result)=>{
                        if(removal_result.result === false){
                            reject(
                                {
                                    expected:false,
                                    message:`logical removal error: ${removal_result.message}`
                                }
                            )
                        }

                        if(removal_result.result === true){
                            resolve(
                                {
                                    result:true,
                                    affected_item_details:(({ title, colour,imgURL,urlKey }) => ({ title, colour,imgURL,urlKey }))(item),
                                    details:{
                                        item_removed:removal_result.item_removed,
                                        size_obj_removed:removal_result.size_obj_removed,
                                        qty_val_decreased:removal_result.qty_decreased,
                                        was_decrease_overflow: size_obj.qty < 0 ? true : false,
                                        decrease_overflow_val: size_obj.qty < 0 ? -(size_obj.qty) : undefined
                                    },
                                }
                            )
                        }

                    })
                    .catch((error)=>{
                        reject(
                            {
                                expected:false,
                                error:error
                            }
                        )
                    })

                }

                if(size_obj.qty > 0){
                    resolve(
                        {
                            result:true,
                            affected_item_details:(({ title, colour,imgURL,urlKey }) => ({ title, colour,imgURL,urlKey }))(item),
                            details:{
                                item_removed:false,
                                size_obj_removed:false,
                                qty_val_decreased:true,
                                was_decrease_overflow: size_obj.qty < 0 ? true : false,
                                decrease_overflow_val: size_obj.qty < 0 ? -(size_obj.qty) : undefined
                            },
                        }
                    )
                }


            })
            .catch((error)=>{
                reject(
                    {
                        expected:false,
                        error:error,
                    }
                )
            })



        })
    }





    function mark_item_sold(authKey,urlKey,size_qty_obj_arr){
        return new Promise(async (resolve,reject)=>{

            let sizes_for_markSold = []


            for(let size_obj of size_qty_obj_arr){

                let size = size_obj.size

                let req_size_obj = sizes_for_markSold.find((req_size_obj)=>req_size_obj.size === size)
                if(req_size_obj !== undefined){
                    req_size_obj.qty += size_obj.qty
                } else{
                    sizes_for_markSold.push(size_obj)
                }



            }


            for(let size_obj of sizes_for_markSold){

                let size = size_obj.size
                let qty = size_obj.qty

                const result = await new Promise((resolve,reject)=>{
                    current_stock_decrease_AIO(authKey,urlKey,size,qty)
                    .then((item_decrease_result)=>{

                        if(item_decrease_result.result === false){
                            resolve(
                                {
                                    result:false,
                                    message:`false result during removal of current stock, thrown message: '${item_decrease_result.message}'`
                                }
                            )
                        }

                        if(item_decrease_result.result === true){

                            qty = item_decrease_result.details.was_decrease_overflow ? qty - item_decrease_result.details.decrease_overflow_val : qty

                            add_item(
                                authKey,
                                urlKey,
                                [
                                    {
                                        size:size,
                                        qty:qty
                                    }
                                ],
                                item_decrease_result.affected_item_details.title,
                                item_decrease_result.affected_item_details.imgURL,
                                item_decrease_result.affected_item_details.colour
                            )
                            .then((_)=>{
                                resolve(
                                    {
                                        result:true,
                                        message:"successfully marked item as sold",
                                        details:item_decrease_result
                                    }
                                )
                            })
                            .catch((error)=>{
                                reject(
                                    {
                                        expected:false,
                                        message:"error adding item to sold stock list (ITEM WAS REMOVED FROM CURRENT STOCK)",
                                        error:error
                                    }
                                )
                            })

                        }

                    })
                    .catch((error)=>{
                        reject(
                            {
                                expected:false,
                                message:"error during mark sold, removing item from users current stock",
                                error:error
                            }
                        )
                    })
                })
                .catch((error)=>{
                    reject(error)
                })

            }

            resolve()
        })
    }


    api_private_stock_item_markSold
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
                            bail:true,
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
            
            let promises = []
            for (let update of req.body.updates){                
                promises.push(mark_item_sold(req.session.authKey,update.urlKey,update.sizes))
            }


            Promise.all(promises)
            .then((_)=>{
                res.status(200).send({
                    result:true,
                    message:"Successfully marked item(s) sold within user's stock"
                })
            })
            .catch((error)=>{
                next({
                    expected:false,
                    message:"Error marking item(s) sold within user's stock",
                    error:error
                })
            })

        }   
    )
    
    return api_private_stock_item_markSold
}

module.exports = build_api_private_stock_item_markSold