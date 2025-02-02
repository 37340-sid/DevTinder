const express =require('express')
const {userAuth} =require('../middleware/auth')
const ConnectionRequestModel = require('../models/connectionRequest')
const User =require('../models/user')

const requestRouter=express.Router()

requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
    try {
        const formUserId = req.user._id
        const toUserId =req.params.toUserId
        const status =req.params.status

        const allowedStatus=['ignored','interested']
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid stauts type: "+ status})
        }

        const toUser= await User.findById(toUserId)
        if(!toUser){
            return res.status(400).json({message:"User not found"})
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                { formUserId,toUserId},
                { formUserId:toUserId,toUserId:formUserId},
            ],
        })
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection Request Already exist!"})
        }

        const connectionRequest =new ConnectionRequestModel({
            formUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }

    // const user=req.user
    // console.log("Sending a connection request")
    // res.send(user.firstName + " Sent the connection request")
})

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try {
        const loggedInUser =req.user
        const {status,requestId} =req.params
        console.log(status)
        console.log(requestId)
        const allowedStatus =['accepted','rejected']
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed"})
        }
        const connectionRequest =await ConnectionRequestModel.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:'interested',
        })
        if(!connectionRequest){
            return res.status(400).json({message:'Connection Request Not found'})
        }
        connectionRequest.status=status
        const data = await connectionRequest.save()
        res.json({message: 'Connection Request ' + status , data})
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

module.exports=requestRouter