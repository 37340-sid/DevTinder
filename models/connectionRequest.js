const mongoose =require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    formUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//reference to user model
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum: {
            values:["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},{timestamps:true})


connectionRequestSchema.index({formUserId:1,toUserId:1})

connectionRequestSchema.pre('save',function(next){
    const connectionRequest=this;
    if(connectionRequest.formUserId.equals(connectionRequest.toUserId)){
        throw new Error('are you mad..? requesting yourself dumb..')
    }
    next()
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema)
module.exports =ConnectionRequestModel