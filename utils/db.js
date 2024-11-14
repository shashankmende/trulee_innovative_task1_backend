
const mongoose = require('mongoose')

const ConnectDb =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected")
        
    } catch (error) {
        console.log("Failed to connect to db")
        process.exit(1)
    }
}

module.exports  =ConnectDb