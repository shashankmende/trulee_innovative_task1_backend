const mongoose = require('mongoose');

const formatDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  let hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${day}/${month}/${year} ${hour}:${minute} ${ampm}`;
};

const MockInterviewSchema = new mongoose.Schema({
  Title: String,
  skills: [
    {
      skill: String,
      experience: String,
      expertise: String,
    },
  ],
  DateTime: String,
  Interviewer: String,
  Duration: String,
  ModifiedDate: Date,
  ModifiedBy: String,
  Category: String,
  Description: String,
  jobResponsibilities: String,
  CandidateName: String,
  HigherQualification: String,
  Experience: String,
  Technology: String,
  Status: String,
  CreatedDate: { type: String, default: formatDateTime },
  CreatedBy: String,
  CreatedById: String,
  LastModifiedById: String,
  ownerId: String,
  tenantId: String,
});
//   const MockInterviewHistorySchema = new mongoose.Schema({
//     MockInterviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockInterview', required: true },
//     Title: String,
//     Skills: String,
//     DateTime: String,
//     Interviewer: String,
//     Duration: String,
//     CreatedDate: String,
//     CreatedBy: String,
//     ModifiedDate: Date,
//     ModifiedBy: String,
//     Category: String,
//     Description: String,
//     Status: String,
//     Action: String,  // e.g., 'Created', 'Updated', 'Deleted'
// });

// const MockInterviewHistory = mongoose.model("MockInterviewHistory", MockInterviewHistorySchema);
const MockInterview = mongoose.model("MockInterview", MockInterviewSchema);
module.exports = {
  MockInterview,
  // MockInterviewHistory
};