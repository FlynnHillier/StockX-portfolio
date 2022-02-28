const {join} = require("path")
const MongoStore = require("connect-mongo")

    let init_settings = {
        port : 5000,
        listen_retry_attempts : 3,
        listen_retry_delay : 4000,
        listen_silent : true,
        mongoClient_connection_config: {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 6000
        }
    }


    let directories = {
        static:join(__dirname,"static_content"),
        routes:join(__dirname,"routes"),
    }

    let mongo = {
        access_uri:"mongodb+srv://app-dev:temp@cluster0.jjpy4.mongodb.net/stockX-Portfolio-App?retryWrites=true&w=majority",
        mongoose_models: require("./mongoose_models.js")
    }


    let sessions = {
        secret:"ThisIsMySecretToYou!",
        saveUninitialized:true,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 14},
        resave: true,
        store:MongoStore.create({
            mongoUrl:mongo.access_uri,
            ttl: 60 * 60 * 24 * 14,
            autoRemove:"interval",
            autoRemoveInterval:10,
        }),
    }   







module.exports = {
    init_settings:init_settings,
    
    global_config: {
        directories:directories,
        sessions:sessions,
        mongo:mongo,
    }
}