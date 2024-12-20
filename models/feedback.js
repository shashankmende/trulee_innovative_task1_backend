const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  CandidateName: String,
  Position: String,
  Interviewer: String,
  InterviewDate: Date,
  InterviewType: String,
});

const QuestionsSchema = new mongoose.Schema({
  QuestionId: String,
  CandidateAnswer: String,
  Mandatory: Boolean,
  Note: String,
  ResponseType: String,
  QuestionFeedback: {
    IsLiked: Boolean,
    Reason: String,
  },
});

const SkillsSchema = new mongoose.Schema({
  SkillName: String,
  Rating: Number,
  Note: String,
});

const OverallImpressionSchema = new mongoose.Schema({
  OverallRating: Number,
  Recommendation: String,
  Note: String,
});

// InterviewFeedback
const FeedbackSchema = new mongoose.Schema(
  {
    Candidate: CandidateSchema,
    Questions: [QuestionsSchema],
    Skills: [SkillsSchema],
    OverallImpression: OverallImpressionSchema,
  },
  { timestamps: true }
);

const FeedbackModel = mongoose.model("feedback", FeedbackSchema);

module.exports = FeedbackModel;
