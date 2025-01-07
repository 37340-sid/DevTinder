const express=require('express')
const {userAuth} =require('../middleware/auth')

const profileRouter=express.Router()

profileRouter.get('/profile',userAuth,async(req,res)=>{
    const user=req.user
    if(!user){
        throw new Error("User does not exists")
    }
    res.send(user)
})

module.exports=profileRouter
