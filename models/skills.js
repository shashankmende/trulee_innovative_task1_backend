
const mongoose = require('mongoose')

const SkillSSchema = new mongoose.Schema({
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

module.exports =  mongoose.model("skills",SkillSSchema)