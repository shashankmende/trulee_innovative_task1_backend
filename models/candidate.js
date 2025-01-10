const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Phone: String,
    Date_Of_Birth: Date,
    Gender: String,
    HigherQualification: String,
    UniversityCollege: String,
    CurrentExperience: Number,
    PositionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
    skills: [
        {
            skill: String,
            experience: String,
            expertise: String,
        },
    ],
    // Position: String,
    ImageData: {
        filename: String,
        path: String,
        contentType: String,
    },
    CreatedBy: String,
    LastModifiedById: String,
    ownerId: String,
    tenantId: String,
    CreatedDate: { type: Date, default: Date.now }
});


// const candidateHistorySchema = new mongoose.Schema({
//     candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },

//     FirstName: String,
//     LastName: String,
//     Email: String,
//     Phone: String,
//     Date_Of_Birth: Date,
//     Gender: String,
//     HigherQualification: String,
//     UniversityCollege: String,
//     CurrentExperience: Number,
//     PositionId: String,
//     skills: [
//         {
//             skill: String,
//             experience: String,
//             expertise: String,
//         },
//     ],
//     // Position: String,
//     ImageData: {
//         filename: String,
//         path: String,
//         contentType: String,
//     },
//     CreatedBy: String,
//     LastModifiedById: String,
//     ownerId: String,
//     orgId: String,

//     ModifiedDate: { type: Date, default: Date.now },
//     ModifiedBy: String,
// });

const Candidate = mongoose.model("Candidate", candidateSchema);
// const CandidateHistory = mongoose.model("CandidateHistory", candidateHistorySchema);

module.exports = { Candidate };