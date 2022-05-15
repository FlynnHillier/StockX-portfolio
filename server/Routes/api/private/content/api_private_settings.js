const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")
const { checkSchema , validationResult } = require("express-validator")

function build_api_private_settings_router(mongoose_instance,config){

    const api_private_settings_router = express.Router()

    api_private_settings_router
    .route("/")
    .get((req,res,next)=>{
        getSavedSettings(req.session.authKey)
        .then((user_info)=>{
            res.status(200).send({
                result:true,
                data:user_info
            })
        })
        .catch((error)=>{
            next(error)
        })
    })
    






    function getSavedSettings(authKey){
        return new Promise(async (resolve,reject)=>{
            try {
                const data = await config.mongo.mongoose_models.user.findOne(
                    {
                        authKey:authKey,
                    },
                    {
                        settings:1
                    },
                    {
                        lean:true
                    }
                )

                if(data === undefined){
                    throw Error("settings field did not exist in mongo")
                }

                resolve(data.settings)
            } catch(err){
                reject(err)
            }



        })
    }


    function commitChangesToMongo(newSettings,authKey){
        return new Promise((resolve,reject)=>{
            config.mongo.mongoose_models.user.updateOne(
                {
                    authKey:authKey
                },
                {
                    "$set":{
                        "settings":newSettings
                    }
                }
            ).then((result)=>{
                resolve(result)
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }






    api_private_settings_router
    .route("/ammend")
    .post(
        checkSchema({
                        updates:{
                            isObject:true,
                            isEmpty:{
                                negated:true,
                                errorMessage:"updates cannot be empty"
                            },
                            errorMessage:"invalid"
                        },
                        "updates.fee":{
                            isDecimal:{
                                errorMessage:"must be number"
                            },
                            custom:{
                                options:(val)=>{
                                    if(val > 100 || val < 0){
                                        return Promise.reject("must be number of (setNotation): [0,100]")
                                    } else{
                                        return true
                                    }
                                }
                            }
                            

                        }
                        
        }),
        async (req,res,next)=>{
            const req_errors = validationResult(req).errors

            if(req_errors.length !== 0){
                return next({
                    expected:true,
                    message:`${req_errors[0].msg}, field: ${req_errors[0].param}`
                })
            }

            try {
                const currentSettings = await getSavedSettings(req.session.authKey)
                if(currentSettings === undefined){
                    throw("settings field was not located in mongo")
                }

                const settingsKeys = Object.keys(currentSettings)
                let updatedSettings = Object.assign({},currentSettings)

                for(let updateKey of Object.keys(req.body.updates)){
                    if(!(settingsKeys.includes(updateKey))){
                        throw Error(`${updateKey} is not an existing setting. hence it cannot be updated. No updates were completed.`)
                    }
                    updatedSettings[updateKey] = req.body.updates[updateKey]
                }


                try {
                    await commitChangesToMongo(updatedSettings,req.session.authKey)
                } catch(err){
                    console.error(err)
                    throw ("unable to commit updated settings to mongo")
                }

                res.status(200).send({
                    result:true,
                    updatedSettings:updatedSettings
                })


            } catch(err){
                next(err)
            }
    })









    
   
    return api_private_settings_router
}


module.exports = build_api_private_settings_router