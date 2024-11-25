
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth:{
    type:Date,
    required:true

  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address']
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  higherQualification:{
    type:String,
    required:true,
  },
  college:{
    type:String,
    required:true,

  },
  experience: {
    type: Number,
    required: true,
    min: 0 
  },
  position:{
    type:String,
    required:true 
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: "Skills array should contain at least one skill."
    }
  },
  photo:{
    data:Buffer,
  }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);
module.exports = Candidate;
