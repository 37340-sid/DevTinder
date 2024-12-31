const mongoose=require('mongoose')

const connectDB= async ()=>{
    await mongoose.connect(
        "mongodb+srv://siddharthk120:Siddharth123@cluster0.49fin9w.mongodb.net/usertinder?retryWrites=true&w=majority&appName=Cluster0")
}

module.exports =connectDB
