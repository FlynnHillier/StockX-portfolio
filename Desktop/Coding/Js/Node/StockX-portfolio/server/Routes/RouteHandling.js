const path = require("path")

function route_handling(app,mongoose_instance,config){


    const api = require(config.directories.routes,"api","api_RouteHandling.js")(mongoose_instance,config)




    app.use("/api",api)



    app.use(express.static(config.directories.static))

    app.use("*",(req,res)=>{
        res.status(404).send("The requested resource was not found.")
    })
}


module.exports = route_handling