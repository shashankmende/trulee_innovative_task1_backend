const mongoose = require('mongoose');

const CandidateAssessmentSchema = new mongoose.Schema({
    scheduledAssessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledAssessment', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed', 'cancelled', 'failed', 'rescheduled'], 
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
    createdAt: { type: Date, default: Date.now }
},{timestamps:true});


const AnswerSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    candidateAssessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateAssessment', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentQuestion', required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, default: null },
    score: { type: Number, default: 0 },
    isAnswerLater: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now }
},{timestamps:true});



const ResultSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    candidateAssessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateAssessment', required: true },
    totalScore: { type: Number, required: true },
    status: { type: String, enum: ['pass', 'fail'], required: true },
    completionTime: { type: Date },
    createdAt: { type: Date, default: Date.now }
},{timestamps:true});


const CandidateAssessment = mongoose.model('CandidateAssessment', CandidateAssessmentSchema)
const Answer = mongoose.model("AnswerSchema",AnswerSchema)
const Result = mongoose.model("ResultSchema",ResultSchema)

module.exports = {CandidateAssessment,Answer,Result}