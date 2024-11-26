const mongoose = require("mongoose");

const positionsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique:true,
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    jobDescription: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: {
            min: { type: Number, required: true },
            max: { type: Number, required: true}
        },
        required: true
    },
    skills: [{

        type: mongoose.Schema.Types.ObjectId,
        ref:'skills',
        required: true
    }],
    skills:[{
        type:String,
        required:true,
    }],
    additionalNotes: {
        type: String,
        
    },
    rounds: {
        type: [
            String
        ],
        
    }
},{timestamps:true});

const PositionModel = mongoose.model("positions", positionsSchema);

module.exports = PositionModel;
