const Assessment = require("../models/assessment");
const { isValidObjectId } = require('mongoose');

exports.newAssessment = async (req, res) => {
    try {
      const {
        AssessmentTitle,
        AssessmentType,
        NumberOfQuestions,
        Position,
        DifficultyLevel,
        Duration,
        ExpiryDate,
        Sections,
        CandidateDetails,
        Instructions,
        AdditionalNotes,
        CreatedBy,
        OwnerId,
        orgId,
        totalScore,
        passScore
      } = req.body;
  
      const newAssessmentData = {
        AssessmentTitle,
        AssessmentType,
        Position,
        Duration,
        DifficultyLevel,
        NumberOfQuestions,
        ExpiryDate,
        Instructions,
        AdditionalNotes,
        CreatedBy,
        OwnerId,
        orgId,
        totalScore,
        passScore
      };
  
      if (Sections && Sections.length > 0) {
        newAssessmentData.Sections = Sections.map(section => ({
          ...section,
          Questions: section.Questions.map(question => {
            const baseQuestion = {
              Question: question.Question,
              QuestionType: question.QuestionType,
              DifficultyLevel: question.DifficultyLevel,
              Score: question.Score,
              Answer: question.Answer,
              Hint: question.Hint || null,
              CharLimits: question.CharLimits,
            };
  
            if (question.QuestionType === 'MCQ' && question.Options && question.Options.length > 0) {
              baseQuestion.Options = question.Options;
            }
  
            if (question.QuestionType === 'Programming Questions' && question.ProgrammingDetails && question.ProgrammingDetails.length > 0) {
              baseQuestion.ProgrammingDetails = question.ProgrammingDetails;
            }
  
            if ((question.QuestionType === 'Short Text(Single line)' || question.QuestionType === 'Long Text(Paragraph)') && question.AutoAssessment?.enabled) {
              baseQuestion.AutoAssessment = {
                enabled: question.AutoAssessment.enabled,
                matching: question.AutoAssessment.matching
              };
            }
  
            return baseQuestion;
          })
        }));
      }
  
      if (CandidateDetails && (CandidateDetails.includePosition || CandidateDetails.includePhone || CandidateDetails.includeSkills)) {
        newAssessmentData.CandidateDetails = CandidateDetails;
      }
  
      const assessment = new Assessment(newAssessmentData);
      await assessment.save();
      res.status(201).json(assessment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

exports.updateAssessment = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("requ body",req.body)
  
      // Validate the ID
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid ID format." });
      }
  
  
      
      const updatedAssessment = await Assessment.findByIdAndUpdate(
        id,
        req.body,
        
      );
  
      if (!updatedAssessment) {
        return res.status(404).json({ error: "Assessment not found." });
      }
  
      res.status(200).json({ message: "Updated successfully.", data: updatedAssessment });
    } catch (error) {
      console.error("Error updating assessment:", error);
      res.status(500).json({ error: error.message });
    }
  }