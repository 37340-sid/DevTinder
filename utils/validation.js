const validator=require('validator')

const validaSignUpData =(req,res)=>{
    const {firstName,lastName,email,password}=req.body
    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }
    else if(!validator.isEmail(email)){
        throw new Error("email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('password is not strong')
    }
}

const validateProfileEditData =(req,res)=>{
    const allowedFields=["firstName","lastName","email","age","gender","skills","about"]
    const isEditAllowed=Object.keys(req.body).every(field => allowedFields.includes(field))
    return isEditAllowed;
}

module.exports={validaSignUpData,validateProfileEditData}