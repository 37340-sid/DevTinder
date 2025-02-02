const express=require('express')
const userRouter =express.Router()
const {userAuth} =require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User =require('../models/user')

userRouter.get('/user/requests/received', userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequest =await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('formUserId',["firstName","lastName"]) // we can use string to get specific field data "firstName lastName" like that
        res.json({message: 'Data fatched successfully', data: connectionRequest})
    } catch (err) {
        res.status(400).send("Error :" + err.message)
    }
})

userRouter.get('/user/connections', userAuth , async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequest= await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {formUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate('formUserId','firstName lastName').populate('toUserId','firstName lastName')
        const data=connectionRequest.map((row)=>{
            if(row.formUserId._id.toString() === row.toUserId._id.toString()){
                return row.toUserId
            }
            return row.formUserId
        })
        res.json({data})
    } catch (error) {
        res.status(400).send("Error :" + error.message)
    }
})

userRouter.get('/feed',userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const page =parseInt(req.query.page) || 1;
        let limit =parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50: limit
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                {formUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select('formUserId toUserId')
        const hideUserFromFeed = new Set()
        connectionRequest.forEach(req =>{
            hideUserFromFeed.add(req.formUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })
        console.log(hideUserFromFeed)
        const users = await User.find({
            $and:[
                {_id : {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select('firstName lastName').skip((page-1)*limit).limit(limit)
        res.send(users)
    } catch (error) {
        res.status(400).send("Message:" + error.message)
    }
})





module.exports=userRouter