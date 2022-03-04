const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")


function build_auth_root_router(mongoose_instance,config){

    const auth_root_router = express.Router()



    auth_root_router
    .route("/")
    .post((req,res)=>{
        if(req.session.authKey !== undefined){
            res.send({
                result:true,
            })
        } else{
            res.send({
                result:false
            })
        }
    })









    
   
    return auth_root_router
}


module.exports = build_auth_root_router