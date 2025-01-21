const { TenantQuestions } = require("../models/myQuestionList");


//change name to myQuestionsList

exports.newQuestion =  async (req, res) => {
    try {
      const newquestion = new TenantQuestions(req.body); // Directly use req.body
      const question = await newquestion.save();
      const questions = await TenantQuestions.find({ ownerId: req.body.ownerId }); // Ensure you filter correctly
      res.status(201).json(question);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

