const {join} = require("path")

module.exports = {

    init_settings:{
        port : 5000,
        listen_retry_attempts : 3,
        listen_retry_delay : 4000,
        listen_silent : true,
        mongoClient_connection_config: {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 6000
        }
    },

    global_config:{

        directories:{
            static:join(__dirname,"static_content"),
            routes:join(__dirname,"routes"),
        },

        mongo:{
            access_uri:"mongodb+srv://app-dev:temp@cluster0.jjpy4.mongodb.net/stockX-Portfolio-App?retryWrites=true&w=majority",
            mongoose_models: require("./mongoose_models.js")
        }
    }



}