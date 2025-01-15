require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const ConnectDb = require("./utils/db");
const router = require("./routes/positionsRoutes");
// const ticketRouter = require('./routes/ticketsRoute')
const feedbackRouter = require("./routes/feedbackRoute");
const suggestedQuestionRouter = require("./routes/suggestedQuestionRoute");
const suggestedQuestionsSKillsRoute = require("./routes/suggestedQuestionsSkillsRoute");
const interviewQuestionsRoute = require("./routes/interviewQuestions.js");
const TenentQuestionsListNamesRoute = require("./routes/TenentQuestionsListNames.js");
const cors = require("cors");
const path = require("path");
const { TenentQuestions } = require("./models/NewQuestion.js");
const QuestionbankFavList = require("./models/questionbankFavList.js");
const { Users } = require("./models/Users.js");
const { Skills } = require("./models/skills.js");
const Profile = require("./models/Profile.js");
const Role = require("./models/RolesData.js");
const {
  HigherQualifications,
  HigherQualification,
} = require("./models/higherqualification.js");
const { University_CollegeName } = require("./models/college.js");
const SharingRule = require("./models/SharingRules.js");
const {
  Organization,
  OrganizationHistory,
} = require("./models/Organization.js");
const {
  TechnologyMaster,
  TechnologyMasterHistory,
} = require("./models/TechnologyMaster.js");
const Assessment = require("./models/assessment.js");
const AssessmentQuestionsSchema = require("./models/AssessmentQuestions.js");
const AssessmentRoute = require("./routes/assessment.js");
const TenantRoute = require("./routes/tenantQuestions.js");

const { isValidObjectId } = require("mongoose");
const Section = require("./models/Sections.js");
const { addSection } = require("./controllers/section.js");
const { getQualifications } = require("./controllers/higherQualification.js");
const {
  getUniversityCollegeNames,
} = require("./controllers/universityCollegeName.js");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/", router);
// app.use('/ticket/',ticketRouter)
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/feedback", feedbackRouter);
app.use("/suggested-questions", suggestedQuestionRouter);
// app.use('/skills',suggestedQuestionsSKillsRoute)
app.use("/interview-questions", interviewQuestionsRoute);
app.use("/tenant-list", TenentQuestionsListNamesRoute);

app.use("/tenant", TenantRoute);
const {
  loginController,
  getUserByRoleId,
  getUsersByOrganization,
  getUserById,
} = require("./controllers/user.js");
const { getRolesBasedOnOrganization } = require("./controllers/role.js");
const {
  addAssessmentQuestion,
  getAssessmentQuestionsBasedOnAssessmentId,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
} = require("./controllers/assessmentQuestions.js");
const {
  getProfileBasedOnId,
  getRoleBasedOnId,
  getRolesDataBasedonId,
  getRolesDataBasedOnOrganization,
} = require("./controllers/profile.js");
const { getFormattedQuestions, newQuestion } = require("./controllers/tenantQuestions.js");
const { newAssessment, updateAssessment } = require("./controllers/assessment.js");

// app.get('/skills',async(req,res)=>{
//     try {
//         const skills = await Skills.find({});
//         res.json(skills);
//       } catch (err) {
//         res.status(500).json({ message: err.message });
//       }
// })

app.get("/skills", async (req, res) => {
  try {
    const skills = await Skills.find({});
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const modelMapping = {
  // 'candidate': Candidate,
  // 'position': Position,
  // 'team': Team,
  assessment: Assessment,
  // 'interview': Interview,
  // 'mockinterview': MockInterview,
  // 'newquestion': TenentQuestions,
  users: Users,
  rolesdata: Role,
  profiles: Profile,
  tenentquestions: TenentQuestions,
};

app.get("/api/:model", async (req, res) => {
  const { model } = req.params;
  console.log("model", model);
  const { tenantId, ownerId } = req.query;

  // Get the correct model based on the endpoint
  const DataModel = modelMapping[model.toLowerCase()];

  if (!DataModel) {
    return res.status(400).json({ message: "Invalid model" });
  }

  if (!tenantId && !ownerId) {
    return res.status(400).json({ message: "tenantId or ownerId is required" });
  }

  try {
    let data;

    // Build the query dynamically based on tenantId or ownerId
    const query = DataModel.find(tenantId ? { tenantId } : { ownerId });

    // Apply populate for Candidate model
    if (model.toLowerCase() === "candidate") {
      query.populate({
        path: "PositionId",
      });
    }

    // If the model is 'tenentquestions', apply additional logic
    if (model.toLowerCase() === "tenentquestions") {
      const questions = await TenentQuestions.find()
        .populate({
          path: "suggestedQuestionId",
          model: "suggestedQuestions",
        })
        .populate({
          path: "tenentListId",
          model: "TenentQuestionsListNames",
          select: "label name ownerId tenantId",
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
    res.status(500).json({ message: "Internal server error", error });
  }
});

app.get("/auth/users/:id", getUserById);

app.get("/api/profiles/:id", getProfileBasedOnId);

app.get("/api/roles/:id", getRoleBasedOnId);

app.get("/rolesdata/:id", getRolesDataBasedonId);

app.get("/rolesdata", getRolesDataBasedOnOrganization);

app.get("/qualification", getQualifications);

app.get("/universitycollege", getUniversityCollegeNames);

// route for login from admin page
app.post("/organization/login", loginController);

app.get("/getUsersByRoleId", getUserByRoleId);

app.get("/api/users/organization/:organizationId", getUsersByOrganization);

app.get("/api/rolesdata/:organizationId", getRolesBasedOnOrganization);

app.get("/technology", async (req, res) => {
  try {
    const technology = await TechnologyMaster.find({});
    res.json(technology);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//tenant
app.get('/questions', getFormattedQuestions);
app.post('/newquestion', newQuestion);
//assessment


// Route definition

//create assessment
app.post('/assessment',newAssessment)

app.patch('/assessment/:id',updateAssessment)

//assessmentQuestions
app.post("/assessment-questions", addAssessmentQuestion);

//get assessment question based on assessment id
app.get("/assessment-question/:id", getAssessmentQuestionsBasedOnAssessmentId);

//delete assessment question, update order
app.delete("/assessment-question/:id", deleteAssessmentQuestion);

app.patch("/assessment-questions", updateAssessmentQuestion);

app.post("/section", addSection);

ConnectDb().then(() => {
  app.listen(PORT, () => console.log("server is running at :", PORT));
});
