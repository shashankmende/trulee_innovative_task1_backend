const ScheduledAssessmentSchema = new mongoose.Schema({
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }, 
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview'}, 
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true }, 
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true }, // Schedule-specific expiry
    isActive: { type: Boolean, default: true }, // Control individual schedules
    assessmentLink: { type: String, required: true },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields
 
module.exports = mongoose.model('ScheduledAssessment', ScheduledAssessmentSchema)