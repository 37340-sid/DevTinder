const mongoose=require('mongoose')

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
        trim:true
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:18
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

const User = mongoose.model("User",userSchema)
module.exports=User


