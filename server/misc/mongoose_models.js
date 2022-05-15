
const mongoose = require("mongoose")
const Url = require("mongoose-type-url")
require('mongoose-type-url')



const model = mongoose.model
const schema = mongoose.Schema



const size_schema = new schema({
    _id:false,
    size:{
        required:true,
        type:Number,
        min:0,
        max:20,
        validate:{
            validator: function(number){
                return number % 0.5 === 0
            },
            message:"Not a valid size (must be multiple of 0.5)"
        }
    },
    qty:{
        type:Number,
        min:0,
        default:0,
        required:true,
    }


})


const stock_item_schema = new schema({
    required:false,
    urlKey:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        default:"__SHOE TITLE__"
    },
    colour:{
        type:String,
        required:true,
        default:"__COLOUR__"
    },
    imgURL:{
        type:Url,
        required:true,
    },
    sizes:[size_schema],
})




const stock_schema = new schema({
    _id:false,
    stats:{
        totalValue:{
            type:Number,
            required:true,
            default:0,
        },
        totalItems:{
            type:Number,
            required:true,
            default:0,
        }
    },
    current:{
        required:true,
        default:[],
        type:[stock_item_schema]



    },
    sold:{
        required:true,
        default:[],
        type:[stock_item_schema]

    }
})


const settings_schema = new schema({
    _id:false,
    fee:{
        type:Number,
        max:1,
        min:0,
        default:0,
        required:true,
    }
})



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
        },
        settings:settings_schema,
        stock:stock_schema
    })),

}






module.exports = mongoose_models