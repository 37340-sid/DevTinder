const express=require('express')
const connectDB =require('./config/database')
const User =require('./models/user')
const app=express()

app.use(express.json())

app.get('/getuser', async (req,res)=>{
    const userEmail=req.body.email;
    try{
        const user=  await User.findOne({email: userEmail})
        if(!user){
            res.status(400).send("user not found")
        }else{
            res.send(user)
        }
     
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})
app.get('/feed', async (req,res)=>{
    const userEmail=req.body.email;
    try{
        const user=  await User.find()
            res.send(user)
        
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})
app.post('/signup',async (req,res)=>{
    console.log(req.body.firstName)
    const user=new User (req.body)
    try{
        await user.save()
        res.send('User added succssfully')
    }catch (err){
        res.status(400).send('failed')
    }
})
app.delete('/user', async(req,res)=>{
    const userId=req.body.userId
    try{
         const user = await User.findByIdAndDelete(userId)
         res.send("user deleted successfully")
    } catch(err){
        res.status(400).send("Something went wrong")
    }
})
app.patch('/user', async(req,res)=>{
    const userId= req.body.userId;
    const data=req.body;
    try{
        const user= await User.findByIdAndUpdate({_id : userId},data,{
            returnDocument:'after' //getting data before update with using returnDocument(before,after)
        })
        console.log(user)
        res.send("User updated successfully!")
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})


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


