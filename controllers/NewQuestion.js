

// const newQuestionSchema = new mongoose.Schema({
//     Question: String,
//     QuestionType: String,
//     Skill: String,
//     DifficultyLevel: String,
//     Score: String,
//     Answer: String,
//     Options: [String],
//     CreatedDate: { type: Date, default: Date.now },
//     createdBy: String,
//     orgId: String,
//     OwnerId: String,
// });

// const newQuestionHistorySchema = new mongoose.Schema({
//     newQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewQuestion' },
//     Question: String,
//     QuestionType: String,
//     Skill: String,
//     DifficultyLevel: String,
//     Score: String,
//     Answer: String,
//     Options: [String],
//     CreatedDate: Date,
//     createdBy: String,
//     ModifiedDate: { type: Date, default: Date.now },
//     ModifiedBy: String,
//     orgId: String,
//     OwnerId: String,
//     Action: String,
//     ActionDate: { type: Date, default: Date.now }
// });
const mongoose = require('mongoose');

const TenentQuestionsSchema = new mongoose.Schema({
    questionNo: String,
    suggestedQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'suggestedQuestions' },
    tenentListId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TenentQuestionsListNames' }],
    isCustom: { type: Boolean, default: false },
    questionText: String,
    questionType: String,
    technology: [String],
    skill: [String],
    tags: [String],
    difficultyLevel: String,
    // score: String,
    correctAnswer: String,
    options: [String],
    hints: String,
    charLimits: { 
        min: Number,
        max: Number
    },
    minexperience: Number,
    maxexperience: Number,
    isAutoAssessment: Boolean,
    autoAssessment: {
        criteria: String,
        expectedAnswer: String,
        testCases: [
            {
                input: String,
                expectedOutput: String,
                weight: Number
            }
        ]
    },
    programming: {
        starterCode: String,
        language: [String],
        testCases: [
            {
                input: String,
                expected_output: String,
                weight: Number
            }
        ]
    },
    isActive: Boolean,
    createdDate: {
        type: Date,
        default: Date.now
    },
    createdBy: String,
    modifiedDate: Date,
    modifiedBy: String,
    tenentId: String,
    ownerId: String,
});

TenentQuestionsSchema.pre('save', function (next) {
    if (this.isNew) {
        this.CreatedDate = Date.now();
    }
    next();
});

const TenentQuestions = mongoose.model("tenentQuestions", TenentQuestionsSchema);

module.exports = { TenentQuestions };