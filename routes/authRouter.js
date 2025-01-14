const express=require('express')
const {validaSignUpData} =require('../utils/validation')
const User =require('../models/user')
const bcrypt =require('bcrypt')

const authRouter = express.Router()

authRouter.post('/signup',async (req,res)=>{
    //validation od the data

    // console.log(req.body.firstName)
    
    try{
        const {firstName,lastName,email,password,}=req.body

        validaSignUpData(req)
        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash)

        const user=new User ({
            firstName,lastName,email,password:passwordHash
        })

        await user.save()
        res.send('User added succssfully')
    }catch (err){
        res.status(400).send('Error :' + err.message)
    }
})

authRouter.post('/login', async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user =await User.findOne({email:email})
        if(!user){
            throw new Error('Invalid credential')
        }
        const isPasswordValid=await user.verifyPassword(password)
        if(isPasswordValid){

            const token = await user.getJwt()
            res.cookie('token',token,{expires:new Date(Date.now() + 8 * 3600000)})
            res.send("Login successfully")
        }else{
            throw new Error("Invalid credential")
        }
    } catch (err) {
        res.status(400).send('Error :' + err.message)
    }
})

authRouter.post('/logout', async(req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now())
    }),
    res.send("Logout!")
})







module.exports = authRouter;