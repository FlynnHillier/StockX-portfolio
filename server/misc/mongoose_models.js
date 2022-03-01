
const mongoose = require("mongoose")

const model = mongoose.model
const schema = mongoose.Schema

mongoose_models = {

    user:model("user",new schema({password:'string',email:'string'})),

}






module.exports = mongoose_models