// const mongoose = require('mongoose');

// const CandidateAssessmentSchema = new mongoose.Schema({
//     scheduledAssessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledAssessment', required: true },
//     candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
//     status: { 
//         type: String, 
//         enum: ['pending', 'in_progress', 'completed', 'cancelled', 'failed', 'rescheduled'], 
//         default: 'pending' 
//     },
//     isActive: { type: Boolean, default: true }, // Control individual schedules
//     assessmentLink: { type: String, required: true },
//     expiryAt: { type: Date, required: true },
//     startedAt: { type: Date },
//     endedAt: { type: Date },
//     progress: { type: Number, default: 0 },
//     totalScore: { type: Number, default: 0 },
//     rescheduledTo: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateAssessment' },
//     createdAt: { type: Date, default: Date.now }
// },{timestamps:true});


const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentQuestion', required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, default: null },
    score: { type: Number, default: 0 },
    isAnswerLater: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now }
},{timestamps:true});


const sectionSchema = new mongoose.Schema({
    SectionName: String,
    Answers: [AnswerSchema],
    totalScore: Number,
    passScore: Number,
    sectionResult: { type: String, enum: ['pass', 'fail'] },
    // sectionResult: { type: String, enum: ['pass', 'fail'], required: true },
});
 

 
 
const CandidateAssessmentSchema = new mongoose.Schema({
    scheduledAssessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledAssessment', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled', 'failed','pass', 'rescheduled'],
        default: 'pending'
    },
    isActive: { type: Boolean, default: true }, // Control individual schedules
    assessmentLink: { type: String, required: true },
    expiryAt: { type: Date, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    progress: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    rescheduledTo: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateAssessment' },
    createdAt: { type: Date, default: Date.now },
    // completionTime: { type: Date },
    completionTime: { type: String },
    sections: [sectionSchema],
 
},{timestamps:true});


const CandidateAssessment = mongoose.model('CandidateAssessment', CandidateAssessmentSchema)

module.exports = {CandidateAssessment}