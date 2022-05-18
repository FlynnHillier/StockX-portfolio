const path = require("path")
const express = require("express")

function build_current(mongoose_instance,config){
    const current = express.Router()

    current
    .route("/")
    .get((req,res,next)=>{
        config.mongo.mongoose_models.user.findOne(
            {
                "authKey":req.session.authKey,
            },
            {
                "stock.current":true,
            }
        )
        .then((data)=>{
            res.status(200).send(data.stock.current)
        })
        .catch((err)=>{
            next(
                {
                    expected:false,
                    message:"error retrieving user's current stock",
                    error:err
                }
            )
        })
    })


    return current
}

module.exports = build_current