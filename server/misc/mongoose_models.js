
const mongoose = require("mongoose")


const model = mongoose.model
const schema = mongoose.Schema



const sizes_schema = new schema({
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
    quantity:{
        type:Number,
        min:0,
        default:0,
        required:true,
    }


})



const shoe_schema = new schema({
    urlKey:{
        type:String,
        required:true,
        default:"__URL KEY__"
    },
    sizes:{
        type:[sizes_schema],
        required:true,
        default:[]
    },
    title:{
        type:String,
        required:true,
        default:"__SHOE TITLE__"
    },
    imageURL:{
        type:String,
        required:true,
        default:"https://www.google.com"
    },
    color:{
        type:String,
        required:true,
        default:"__COLOR__",
    }



})





const stock_schema = new schema({
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
        type:[shoe_schema],
    },
    sold:{
        required:true,
        type:[shoe_schema]
    },
    _id:false,
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
        stock:stock_schema
    })),



}






module.exports = mongoose_models