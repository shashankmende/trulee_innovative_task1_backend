
const mongoose = require('mongoose')

const skillsMasterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:false,
    }
},{timestamps:true})

module.exports =  mongoose.model("skillsMaster",skillsMasterSchema)