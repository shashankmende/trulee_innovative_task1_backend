
const mongoose = require('mongoose')

const CollegeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    }
},{timestamps:true})

module.exports = mongoose.model("College",CollegeSchema)