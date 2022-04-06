const path = require("path")
const express = require("express")
const bcrypt = require("bcrypt")


function build_auth_logout_router(mongoose_instance,config){

    const auth_logout_router = express.Router()



    auth_logout_router
    .route("/")
    .get(
        (req,res,next)=>{
            try {

                const KeptFields = ["cookie",] //ensure cookie stays
                
                for(let key of Object.keys(req.session)){
                    if(!KeptFields.includes(key)){
                        req.session[key] = undefined
                    }
                }

                res.status(200).send(
                    {
                        result:true,
                        message:"Successfully logged out."
                    }
                )

            } catch(err){
                next(
                    {
                        expected:false,
                        message:"error logging user out",
                        error:err
                    }
                )
            }

        }
    )


   
    return auth_logout_router
}


module.exports = build_auth_logout_router