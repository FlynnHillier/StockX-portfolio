
const mongoose = require("mongoose")


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
    sizes:[size_schema],
    urlKey:{
        type:String,
        required:true,
    }
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


    shoe:model("shoe",new schema({
        _id:{ //Should be urlKey
            type:String,
            required:true,
            default:"__URL KEY__"
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
    }))

}






module.exports = mongoose_models