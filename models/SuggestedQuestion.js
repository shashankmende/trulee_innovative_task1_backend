// const mongoose = require('mongoose');

// const suggestedQuestionSchema = new mongoose.Schema({
//     Question: String,
//     QuestionType: String,
//     Skill: String,
//     DifficultyLevel: String,
//     Score: String,
//     Answer: String,
//     Options: [String],
//     CreatedDate: {
//         type: Date,
//         default: Date.now
//     },
//     CreatedBy: String,
//     ModifiedDate: Date,
//     ModifiedBy: String,
//     // favorites: [{
//     //     userId: String,
//     //     favorite: {
//     //         type: Boolean,
//     //         default: false
//     //     }
//     // }]
// });

// const SuggestedQuestion = mongoose.model("SuggestedQuestion", suggestedQuestionSchema);
// module.exports = {
//     SuggestedQuestion
// };



const mongoose = require('mongoose');


const suggestedQuestionSchema = new mongoose.Schema({
    questionNo: String,// SUGQ-00000, SUGQ-00001,SUGQ-00002
    questionText: String,
    questionType: String,
    isInterviewQuestionOnly: Boolean,
    technology: [String],
    skill: [String],
    tags: [String],
    difficultyLevel: String,
    // score: String,
    correctAnswer: String,
    options: [String],
    hints: [String],
    isAutoAssessment: Boolean,
    minexperience: Number,
    maxexperience: Number,
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
},{timestamps:true});
 
const SuggestedQuestion = mongoose.model("suggestedQuestions", suggestedQuestionSchema);
module.exports = {
    SuggestedQuestion
};