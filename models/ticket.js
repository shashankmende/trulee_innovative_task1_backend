
const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
    issueType:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"New"
    }

},{timestamps:true})

module.exports = mongoose.model("Tickets",TicketSchema)