
const mongoose = require("mongoose")

const model = mongoose.model
const schema = mongoose.Schema

mongoose_models = {

    user:model("user",new schema({
        password:{
            type:String,
            required:true,
        },
        authKey:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        }
    })),

}






module.exports = mongoose_models