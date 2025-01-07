const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt =require('bcrypt')
const jwt =require('jsonwebtoken')

const {Schema}=mongoose

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:100
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error('Gender data is not valid')
            }
        }
    },
    skills:{
        type: [String]
    },
    about:{
        type: String,
        default:"This is about page"
    }
},{timestamps:true})

userSchema.methods.getJwt = async function(req,res){
    const user = this
    const token = await jwt.sign({_id:user._id},'Dev@Tinder$790',{expiresIn : "7d"})
    return token
}

userSchema.methods.verifyPassword =async function(passwordInputByUser){
    const user =this;
    const passwordHash =user.password
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema)
module.exports=User


