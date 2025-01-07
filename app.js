const express=require('express')
const connectDB =require('./config/database')
const cookieParser=require('cookie-parser')
const jwt =require('jsonwebtoken')

const app=express()

app.use(express.json())
app.use(cookieParser())

// app.get('/getuser', async (req,res)=>{
//     const userEmail=req.body.email;
//     try{
//         const user=  await User.findOne({email: userEmail})
//         if(!user){
//             res.status(400).send("user not found")
//         }else{
//             res.send(user)
//         }
     
//     }catch(err){
//         res.status(400).send("Something went wrong")
//     }
// })
// app.get('/feed', async (req,res)=>{
//     const userEmail=req.body.email;
//     try{
//         const user=  await User.find()
//             res.send(user)
        
//     }catch(err){
//         res.status(400).send("Something went wrong")
//     }
// })
// app.delete('/user', async(req,res)=>{
//     const userId=req.body.userId
//     try{
//          const user = await User.findByIdAndDelete(userId)
//          res.send("user deleted successfully")
//     } catch(err){
//         res.status(400).send("Something went wrong")
//     }
// })
// app.patch('/user/:userId', async(req,res)=>{
//     const userId= req.params?.userId;
//     const data=req.body;
  
//     try{
//         const ALLOWED_UPDATES = ['about','gender','age','skills']
//         const isUpdateAllowed =Object.keys(data).every((k) => 
//             ALLOWED_UPDATES.includes(k)
//         )
//         if(!isUpdateAllowed){
//            throw new Error('update now allowed')
//         }
//         if(data.skills.length>10){
//             throw new Error("skills not more than 10")
//         }
//         const user= await User.findByIdAndUpdate({_id : userId},data,{
//             returnDocument:'after', //getting data before update with using returnDocument(before,after)
//             runValidators:true
//         })
//         console.log(user)
//         res.send("User updated successfully!")
//     }catch(err){
//         res.status(400).send("Update failed" + err.message)
//     }
// })

const authRouter= require('./routes/authRouter')
const profileRouter =require('./routes/profile')
const requestRouter =require('./routes/requests')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)

connectDB()
    .then(()=>{
        console.log("db connected!");
        app.listen(3000,()=>{
            console.log("Server is listing in port 3000");
            
        })
    })
    .catch((err)=>{
        console.log('db failed');
        
    })


