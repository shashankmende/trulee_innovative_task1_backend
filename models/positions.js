const mongoose = require("mongoose");

const positionsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
    skills: {
        type: [String],
        required: true
    },
    additionalNotes: {
        type: String,
        
    },
    rounds: {
        type: [
            String
        ],
        
    }
});

const PositionModel = mongoose.model("positions", positionsSchema);

module.exports = PositionModel;
