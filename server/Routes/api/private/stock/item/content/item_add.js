const path = require("path")
const express = require("express")
const { checkSchema , validationResult } = require("express-validator")

function build_api_private_stock_item_add(mongoose_instance,config){
    const api_private_stock_item_add = express.Router()



    function add_new_item_to_user(authKey,urlKey,title,imageURL,colour){
        return new Promise((resolve,reject)=>{
        
            config.mongo.mongoose_models.user.updateOne(
                {
                    authKey:authKey,
                    "stock.current":{
                        "$not":{
                            "$elemMatch":{
                                urlKey:urlKey
                            }
                        }
                    }
                },
                {
                    "$addToSet":{
                        "stock.current":{
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
                    "stock.current":{
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
                        "stock.current.$.sizes":{
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
                        "stock.current.$[item].sizes.$[size].qty":qty
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



    











    
    api_private_stock_item_add
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
                    "updates.*.imgURL":{
                        isEmpty:{
                            negated:true,
                            errorMessage:"empty",
                            bail:true,
                        },
                        isURL:{
                            errorMessage:"not URL",
                            bail:true,
                        },  
                    },
                    "updates.*.title":{
                        isEmpty:{
                            negated:true,
                            errorMessage:"empty",
                            bail:true,
                        },
                        isString:{
                            errorMessage:"not string",
                            bail:true,
                        },  
                    },
                    "updates.*.colour":{
                        isEmpty:{
                            negated:true,
                            errorMessage:"empty",
                            bail:true,
                        },
                        isString:{
                            errorMessage:"not string",
                            bail:true,
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


            let promises = []
            for (let update of req.body.updates){                
                promises.push(add_item(req.session.authKey,update.urlKey,update.sizes,update.title,update.imgURL,update.colour))

            }
            
            Promise.all(promises)
            .then((_)=>{
                res.status(200).send({
                    result:true,
                    message:"Successfully added item(s) to user's stock"
                })
            })
            .catch((error)=>{
                next({
                    expected:false,
                    message:"mongo error adding to user's stock",
                    error:error
                })
            })
        }   
    )
    


    return api_private_stock_item_add
}

module.exports = build_api_private_stock_item_add