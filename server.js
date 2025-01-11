
require('dotenv').config()

const express = require('express')
const ConnectDb = require("./utils/db")
const router = require('./routes/positionsRoutes')
// const ticketRouter = require('./routes/ticketsRoute')
const feedbackRouter = require('./routes/feedbackRoute')
const suggestedQuestionRouter = require('./routes/suggestedQuestionRoute')
const suggestedQuestionsSKillsRoute = require('./routes/suggestedQuestionsSkillsRoute')
const interviewQuestionsRoute = require('./routes/interviewQuestions.js')
const TenentQuestionsListNamesRoute = require('./routes/TenentQuestionsListNames.js')
const cors = require('cors')
const path = require('path')
const { TenentQuestions } = require('./models/NewQuestion.js');
const QuestionbankFavList = require('./models/questionbankFavList.js');
const {Users} = require('./models/Users.js')
const {Skills} = require('./models/skills.js')
const Profile = require('./models/Profile.js');
const Role = require('./models/RolesData.js'); 
const { HigherQualifications,HigherQualification } = require('./models/higherqualification.js');
const { University_CollegeName } = require('./models/college.js')
const SharingRule = require('./models/SharingRules.js');
const { Organization, OrganizationHistory } = require('./models/Organization.js');
const { TechnologyMaster, TechnologyMasterHistory } = require('./models/TechnologyMaster.js');
const Assessment= require('./models/assessment.js')
const AssessmentQuestionsSchema = require("./models/AssessmentQuestions.js")

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/',router)
// app.use('/ticket/',ticketRouter)
app.use('/images',express.static(path.join(__dirname,'public/images')))
app.use('/feedback',feedbackRouter)
app.use('/suggested-questions',suggestedQuestionRouter)
// app.use('/skills',suggestedQuestionsSKillsRoute)
app.use('/interview-questions',interviewQuestionsRoute)
app.use('/tenant-list',TenentQuestionsListNamesRoute)


// app.get('/skills',async(req,res)=>{
//     try {
//         const skills = await Skills.find({});
//         res.json(skills);
//       } catch (err) {
//         res.status(500).json({ message: err.message });
//       }
// })


app.get('/skills', async (req, res) => {
  try {
    const skills = await Skills.find({});
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






const getFormattedQuestions = async (req, res) => {
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
  
  
  // Route definition
  app.get('/questions', getFormattedQuestions);

  const modelMapping = {
    // 'candidate': Candidate,
    // 'position': Position,
    // 'team': Team,
    'assessment': Assessment,
    // 'interview': Interview,
    // 'mockinterview': MockInterview,
    // 'newquestion': TenentQuestions,
    'users': Users,
    'rolesdata': Role,
    'profiles': Profile,
    'tenentquestions': TenentQuestions
  };

  app.get('/api/:model', async (req, res) => {
    const { model } = req.params;
    console.log("model",model)
    const { tenantId, ownerId } = req.query;
  
    // Get the correct model based on the endpoint
    const DataModel = modelMapping[model.toLowerCase()];
  
    if (!DataModel) {
      return res.status(400).json({ message: 'Invalid model' });
    }
  
    if (!tenantId && !ownerId) {
      return res.status(400).json({ message: 'tenantId or ownerId is required' });
    }
  
    try {
      let data;
  
      // Build the query dynamically based on tenantId or ownerId
      const query = DataModel.find(tenantId ? { tenantId } : { ownerId });
  
      // Apply populate for Candidate model
      if (model.toLowerCase() === 'candidate') {
        query.populate({
          path: 'PositionId',
        });
      }
  
      // If the model is 'tenentquestions', apply additional logic
      if (model.toLowerCase() === 'tenentquestions') {
        const questions = await TenentQuestions.find()
          .populate({
            path: 'suggestedQuestionId',
            model: 'suggestedQuestions',
          })
          .populate({
            path: 'tenentListId',
            model: 'TenentQuestionsListNames',
            select: 'label name ownerId tenantId',
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
  
        // Send grouped questions response
        return res.status(200).json(groupedQuestions);
      }
  
      // Fetch data for other models
      data = await query.exec();
      res.status(200).json(data);
  
    } catch (error) {
      console.error(`Error fetching data for ${model}:`, error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  });



  app.get('/auth/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/api/profiles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/roles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.json(role);
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  app.get('/rolesdata/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const role = await Role.findById(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching role', error: error.message });
    }
  });
  
  app.get('/rolesdata', async (req, res) => {
    const { organizationId } = req.query; // Use query parameters
    try {
      const roles = await Role.find({ organizationId }).populate('reportsToRoleId');
      if (!roles || roles.length === 0) {
        return res.status(404).json({ message: 'No roles found for this organization' });
      }
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
  });



  app.get('/qualification', async (req, res) => {
    try {
      const higherqualifications = await HigherQualification.find({}, 'QualificationName');
      res.json(higherqualifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  app.get('/universitycollege', async (req, res) => {
    try {
      const universityCollegeNames = await University_CollegeName.find({}, 'University_CollegeName');
      res.json(universityCollegeNames);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




  // route for login from admin page
  app.post('/organization/login', async (req, res) => {
  const { Email, password } = req.body;

  try {
    // Case-insensitive email search
    const user = await Users.findOne({ Email: new RegExp(`^${Email}$`, 'i') });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: 'Invalid email or password' });
    // }

    // Add this line to include userId and organizationId in the response
    res.status(200).json({ message: 'Login successful', userId: user._id, organizationId: user.organizationId });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/newquestion', async (req, res) => {
  try {
    const newquestion = new TenentQuestions(req.body); // Directly use req.body
    const question = await newquestion.save();
    const questions = await TenentQuestions.find({ ownerId: req.body.ownerId }); // Ensure you filter correctly
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// this sharing rule fetch used in datautils function
app.get('/api/sharing-rules', async (req, res) => {
  const { orgId, objectName, shareWithId } = req.query;

  // Ensure shareWithId is an array
  const shareWithIdArray = Array.isArray(shareWithId) ? shareWithId : [shareWithId];

  try {
    // Validate required parameters
    if (!orgId || !objectName || !shareWithIdArray.length) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    // Query the database for sharing rules
    const sharingRules = await SharingRule.find({
      orgId,
      objectName,
      shareWithId: { $in: shareWithIdArray }
    });

    res.status(200).json(sharingRules);
  } catch (error) {
    console.error('Error fetching sharing rules:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});




app.get('/getUsersByRoleId', async (req, res) => {
  const { organizationId, roleId } = req.query;
  try {
    // Build the query object
    const query = { organizationId };
    if (roleId) {
      query.RoleId = { $in: Array.isArray(roleId) ? roleId : [roleId] };
    }
    // Fetch users based on the query
    const users = await Users.find(query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by organization and role:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});





app.get('/api/users/organization/:organizationId', async (req, res) => {
  const { organizationId } = req.params;
  try {
    const users = await Users.find({ organizationId });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by organization:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/api/rolesdata/:organizationId', async (req, res) => {
  const { organizationId } = req.params;
  try {
    const roles = await Role.find({ organizationId }).populate('reportsToRoleId');
    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: 'No roles found for this organization' });
    }
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
});


app.get('/technology', async (req, res) => {
  try {
    const technology = await TechnologyMaster.find({});
    res.json(technology);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




app.post('/assessment', async (req, res) => {
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
});


const { isValidObjectId } = require('mongoose');
const Section = require('./models/Sections.js')

app.patch('/assessment/:id', async (req, res) => {
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
});


//assessmentQuestions
app.post('/assessment-questions',async(req,res)=>{
  try {
    const question = await AssessmentQuestionsSchema(req.body)
    await question.save()
    return res.status(201).send({
      success:true,
      message:"Question added",
      question
    })
  } catch (error) {
    console.log('error in adding question to assessment questions schema',error)
    return res.status(500).send({
      success:false,
      message:"Failed to add question",
      error:error.message,
    })
  }
})


app.post('/section',async(req,res)=>{
  try {
    const section = await Section(req.body)
    res.status(201).send({success:true,message:"Section Added",section})
  } catch (error) {
    res.status(500).send({success:false,message:"Failed to add section",error:error.message})
  }
})


ConnectDb().then(()=>{
    app.listen(PORT,()=>console.log('server is running at :',PORT))
})

