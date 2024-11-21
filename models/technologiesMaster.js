
const mongoose = require("mongoose")

const TechnologyMasterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:false,
    },
    skills:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"skillsMaster"
        }
    ]
},{timestamps:true})

module.exports = mongoose.model("Technology",TechnologyMasterSchema)