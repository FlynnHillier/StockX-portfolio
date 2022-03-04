const { checkSchema , validationResult } = require("express-validator")


checkSchema({ //for autofill and testing purposes. (ignore)
    _:{
        isEmail:{
            options:true
        }
    }
})




const components = {

    email:{
        in:["body"],
        trim:true,
        isEmpty:{
            negated:true,
            errorMessage:"email field empty",
            bail:true,
        },
        isEmail:{
            errorMessage:"not a valid email",
            bail:true,
        },

        errorMessage:"invalid email",
    },

    password:{
        trim:true,
        isEmpty:{
            negated:true,
            errorMessage:"password field empty",
            bail:true,
        },
        isString:true,
        isLength:{
            errorMessage:"password must be atleast 5 characters long",
            options:{min:5},
            bail:true,
        },
    }

}














module.exports = {
    components:components
}