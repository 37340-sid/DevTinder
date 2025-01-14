const express=require('express')
const {userAuth} =require('../middleware/auth')
const {validateProfileEditData} =require('../utils/validation')
const profileRouter=express.Router()

profileRouter.get('/profile',userAuth,async(req,res)=>{
    const user=req.user
    if(!user){
        throw new Error("User does not exists")
    }
    res.send(user)
})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try {
        if(!validateProfileEditData(req)){
            throw new Error('Invalid Edit request')
        }
        const loggedInUser=req.user
        console.log(loggedInUser)
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]))
        console.log(loggedInUser)
        await loggedInUser.save()
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully!`,
            data:loggedInUser
        })
        
    } catch (error) {
        res.status(400).send("Error :" + error.message)
    }
})

module.exports=profileRouter
