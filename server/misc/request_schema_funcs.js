function create_schema(array_required_keys){ // array_required_keys == ["key","key1","key2"] || [{key:"key1",validation_func:<function, returning true if 'key' value passes its contained validation>},"Key2",{key:"key3",validation_func:<another validation function>}]

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




function isString(data){
    if(typeof data == "string"){
        return true
    } else{
        return false
    }
}


function isEmail(data){
    if(!isString(data)){
        return false
    }
    if(! (data.includes("@") && data.includes("."))){
        return false
    }

    return true
}




module.exports = {
    create: create_schema,
    isEmail: isEmail,
    isString:isString,
}



