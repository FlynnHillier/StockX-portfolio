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
        access_uri:"mongodb+srv://app-dev:temp@cluster0.jjpy4.mongodb.net/StockX-Portfolio-App?retryWrites=true&w=majority",
        mongoose_models: require("./misc/mongoose_models.js")
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


    
    function create_request_schema(array_required_keys){ // array_required_keys == ["key","key1","key2"] || [{key:"key1",validation_func:<function, returning true if 'key' value passes its contained validation>},"Key2",{key:"key3",validation_func:<another validation function>}]

        for(let i = 0; i < array_required_keys.length; i++){
            if(typeof array_required_keys[i] != "string"){
                
                if(typeof array_required_keys[i] != "object"){
                    throw "error creating request schema, provided array must include only elements of type string or object"
                }
                
                if(!( Object.keys(array_required_keys[i]).includes("key") && Object.keys(array_required_keys[i]).includes("validation_func"))){
                    throw "error creating request schema, an object element was provided but did not contain both neccessary keys 'key' & 'validation_func'"
                }


                if(typeof array_required_keys[i].key != "string"){
                    throw "error creating request schema, if object element is passed 'key' key must be of type string"
                }

                if(typeof array_required_keys[i].validation_func != "function"){
                    throw "error creating request schema, if object element is passed 'validation_func' key must be of type function"
                }


            }
        }


        return function(req_body){ //code 0 means required key not present , code 1 means failed verification func


            let failed_keys = []
            for(let i = 0; i < array_required_keys.length; i++){

                if(typeof array_required_keys[i] == "object"){

                    if(!req_body[array_required_keys[i].key]){

                        failed_keys.push({
                            name:array_required_keys[i].key,
                            code:0,  
                        })
                        continue
                        // return {result:false,message:`${array_required_keys[i].key} was an expected key but was not provided.`}
                    }

                    if(!array_required_keys[i].validation_func(req_body[array_required_keys[i].key]) === true){
                        // return {result:false,message:`key '${array_required_keys[i].key}'  did not get a respone of 'true' from the provided validation function`}
                        failed_keys.push({
                            name:array_required_keys[i].key,
                            code:1,  
                        })
                        continue
                    }



                } else{
                    if(!req_body[array_required_keys[i]]){
                        failed_keys.push({
                            name:array_required_keys[i],
                            code:0,  
                        })
                        continue
                    }
                }

            }
            
            if(failed_keys.length == 0){
                return {result:true}
            } else{
                return {result:false,failed_keys:failed_keys}
            }

        }
    }



    let request_schema = {

        user:create_request_schema(["email",{key:"username",validation_func:function(){return false}},"password"]),

    }

    //console.log(request_schema.user({"emaill":"jjj@gmail.com","passwordd":"pass","username":"hello"}))






module.exports = {
    init_settings:init_settings,
    
    global_config: {
        directories:directories,
        sessions:sessions,
        mongo:mongo,
        request_schema:request_schema,
    }
}