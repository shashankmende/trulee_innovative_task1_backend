const { TenentQuestions } = require("../models/NewQuestion");


//change name to myQuestionsList

exports.newQuestion =  async (req, res) => {
    try {
      const newquestion = new TenentQuestions(req.body); // Directly use req.body
      const question = await newquestion.save();
      const questions = await TenentQuestions.find({ ownerId: req.body.ownerId }); // Ensure you filter correctly
      res.status(201).json(question);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

exports.getFormattedQuestions = async (req, res) => {
    try {
      const questions = await TenentQuestions.find()
        .populate({
          path: 'suggestedQuestionId',
          model: 'suggestedQuestions',
        })
        .populate({
          path: 'tenentListId',
          model: 'TenentQuestionsListNames',
          select: 'label name ownerId tenentId',
        })
        .exec();
  
      // Grouping questions by label
      const groupedQuestions = questions.reduce((acc, question) => {
        // Fetch either custom or suggested question based on isCustom
        const questionData = question.isCustom
          ? question // Use the question data directly if custom
          : question.suggestedQuestionId;
  
        // If there's no data, skip
        if (!questionData) return acc;
  
        // Use labels from tenantListId to group questions
        question.tenentListId.forEach((list) => {
          const label = list.label;
          if (!acc[label]) {
            acc[label] = [];
          }
          acc[label].push({
            ...questionData._doc, // Adding question details
            label, // Add label to the question data
            listId: list._id, // Add the list ID
          });
        });
  
        return acc;
      }, {});
  
      res.status(200).json(groupedQuestions); // Send grouped questions
    } catch (error) {
      console.error('Error fetching formatted questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions.' });
    }
  };