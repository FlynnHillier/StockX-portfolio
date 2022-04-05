const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")


function build_auth_root_router(mongoose_instance,config){

    const auth_root_router = express.Router()



    auth_root_router
    .route("/")
    .get(async (req,res,next)=>{
        
        try{
            if(req.session.authKey !== undefined){
                
                const UserInfo = await config.mongo.mongoose_models.user.findOne(
                    {
                        authKey:req.session.authKey
                    },
                    {
                        email:1
                    }
                )
                
                const email = UserInfo.email

                res.send({
                    result:true,
                    email:email
                })
            } else{
                res.send({
                    result:false
                })
            }
        } catch(err){
            next(
                {
                    expected:false,
                    message:"error responding to /auth request",
                    error:err
                }
            )
        }
    })









    
   
    return auth_root_router
}


module.exports = build_auth_root_router