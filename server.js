require("dotenv").config();
const CryptoJS = require('crypto-js');
const crypto = require('crypto');

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
const nodemailer = require("nodemailer")
const { authenticator } = require('otplib');

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
// app.use("/api/", router);
// app.use('/ticket/',ticketRouter)
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/feedback", feedbackRouter);
app.use("/suggested-questions", suggestedQuestionRouter);
// app.use('/skills',suggestedQuestionsSKillsRoute)
app.use("/interview-questions", interviewQuestionsRoute);
app.use("/tenant-list", TenentQuestionsListNamesRoute);
const Otp = require('./models/Otp.js')
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/candidate', candidateRoutes);


app.use("/tenant", TenantRoute);
const {
  loginController,
  getUserByRoleId,
  getUsersByOrganization,
  getUserById,
} = require("./controllers/user.js");
// const {  getRoleBasedOnId, getRolesDataBasedonId } = require("./controllers/role.js");
// const {
//   addAssessmentQuestion,
//   getAssessmentQuestionsBasedOnAssessmentId,
//   updateAssessmentQuestion,
//   deleteAssessmentQuestion,
// } = require("./controllers/assessmentQuestions.js");
const { getProfileBasedOnId } = require("./controllers/profile.js");
const {
  getFormattedQuestions,
  newQuestion,
} = require("./controllers/myQuestionsList.js");
const {
  newAssessment,
  updateAssessment,
  addAssessmentQuestion,
  getAssessmentQuestionsBasedOnAssessmentId,
  updateAssessmentQuestion,
  deleteAssessmentQuestion
} = require("./controllers/assessment.js");
const {
  getRolesDataBasedonOrganization,
  getRoleBasedOnId,
  getRolesDataBasedonId,
  getRolesDataBasedOnOrganization,
} = require("./controllers/rolesData.js");
const { Candidate } = require('./models/candidate.js');
const {Position} = require("./models/position.js");
const scheduledAssessmentsSchema = require("./models/scheduledAssessmentsSchema.js");
const { CandidateAssessment } = require("./models/candidateAssessment.js");

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
  'candidate': Candidate,
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
    res.status(500).json({ message: "Internal server error", error:error.message });
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

// app.get("/api/rolesdata/:organizationId", getRolesBasedOnOrganization);

app.get("/technology", async (req, res) => {
  try {
    const technology = await TechnologyMaster.find({});
    res.json(technology);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//tenant
app.get("/questions", getFormattedQuestions);
app.post("/newquestion", newQuestion);
//assessment

// Route definition

//create assessment
app.post("/assessment", newAssessment);

app.patch("/assessment/:id", updateAssessment);

//assessmentQuestions
app.post("/assessment-questions", addAssessmentQuestion);

//get assessment question based on assessment id
app.get("/assessment-question/:id", getAssessmentQuestionsBasedOnAssessmentId);

//delete assessment question, update order
app.delete("/assessment-question/:id", deleteAssessmentQuestion);

app.patch("/assessment-questions", updateAssessmentQuestion);

app.post("/section", addSection);

//scheduled assessment 
app.post('/schedule-assessment',async(req,res)=>{
  try {
    const scheduledAssessment = await scheduledAssessmentsSchema(req.body)
    await scheduledAssessment.save()
    // console.log('schedule assessment',scheduledAssessment)
    res.status(201).send({
      success:true,
      message:"Assessment Scheduled",
      assessment:scheduledAssessment
    })
  } catch (error) {
    console.log("error in scheduling assessment",error)
    res.status(500).send({
      message:"Failed to schedule assessment",
      success:false,
      error:error.message,
    })
  }
})

//based on assessment id
app.get('/schedule-assessment/:id',async(req,res)=>{
  try {
    const {id}=req.params
    const scheduledAssessment = await scheduledAssessmentsSchema.find({assessmentId:id}).populate('createdBy',"Firstname").populate('assessmentId')
    console.log("scheduled assesmne,",scheduledAssessment)
    return res.status(200).send({
      message:"Retrieved scheduled assessments",
      success:true,
      scheduledAssessment
    })
  } catch (error) {
    console.log("error in getting scheduled assessment from backed",error)
    res.status(500).send({
      message:"Failed to get scheduled assessment",
      success:false,
      error:error.message
    })
  }
})

//based on scheduleasessment id

app.get('/schedule-assessments-list/:id',async(req,res)=>{
  try {
    const {id}=req.params
    const scheduledAssessment = await scheduledAssessmentsSchema.findById(id).populate({path:"assessmentId",populate:{path:"Sections.Questions"}})
    // const scheduledAssessment = await scheduledAssessmentsSchema.findById(id).populate('createdBy',"Firstname").populate('assessmentId')
    console.log("scheduled assesmne,",scheduledAssessment)
    return res.status(200).send({
      message:"Retrieved scheduled assessments",
      success:true,
      scheduledAssessment
    })
  } catch (error) {
    console.log("error in getting scheduled assessment from backed",error)
    res.status(500).send({
      message:"Failed to get scheduled assessment",
      success:false,
      error:error.message
    })
  }
})

app.patch('/schedule-assessment/:id',async(req,res)=>{
  try {
    const {id}=req.params
    const updateScheduleAssessment = await scheduledAssessmentsSchema.findOneAndUpdate({_id:id},{status:"cancelled"},{new:true})
    const updateCandidateAssessments = await CandidateAssessment.updateMany(
      { scheduledAssessmentId: id },
      { status: "cancelled" },
      
    );
    // const docs = await CandidateAssessment.find({scheduledAssessmentId:id})
    // console.log("docs",docs)
    res.status(200).send({
      message:"scheduled assessment and candidate assessment updated successfully",
      success:true
    })

  } catch (error) {
    console.log("Failed to update status of scheduled assessment and candidate assessment")
    res.status(500).send({
      message:"Failed to update status of scheduled assessment and candidate assessment",
      success:false,
      error:error.message
    })
  }
})


//candidate assessment schema 
app.post("/candidate-assessment", async (req, res) => {
  try {
    const candidateAssessments = req.body; // Assuming req.body contains an array of assessments

    if (!Array.isArray(candidateAssessments) || candidateAssessments.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Request body must contain a non-empty array of candidate assessments.",
      });
    }

    // Use insertMany for bulk insertion
    const insertedDocs = await CandidateAssessment.insertMany(candidateAssessments);

    return res.status(201).send({
      success: true,
      message: "Candidate assessments created successfully.",
      data: insertedDocs,
    });
  } catch (error) {
    console.error("Error in creating candidate assessments:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to create candidate assessments.",
      error: error.message,
    });
  }
});


app.get('/candidate-assessment/:id',async(req,res)=>{
  try {
    const {id}=req.params 
    const candidateAssessments = await CandidateAssessment.find({scheduledAssessmentId:id}).populate("candidateId","FirstName Email CurrentExperience")
    // .populate({
    //   path:"scheduledAssessmentId",
    //   populate:{
    //     path:"assessmentId",
    //     // select:
    //   }
    // })
    return res.status(200).send({
      message:"Candidate Assessments Retrieved",
      success:true,
      candidateAssessments
    })
  } catch (error) {
    console.log("error in getting candidate assessment",error)
    return res.status(500).send({
      success: false,
      message: "Failed to get candidate assessments.",
      error: error.message,
    });
  }
})

app.patch('/candidate-assessment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and update the document, or return 404 if not found
    const updateResult = await CandidateAssessment.findOneAndUpdate(
      { _id: id },
      { status: "cancelled" },
      { new: true } // This returns the updated document
    );

    // If no document was found, return a 404
    if (!updateResult) {
      return res.status(404).send({
        success: false,
        message: "Candidate assessment not found",
      });
    }

    res.status(200).send({
      message: "Candidate assessment updated successfully",
      success: true,
      updatedAssessment: updateResult, // Send only the updated document
    });
  } catch (error) {
    console.log("Error in updating candidate assessment status:", error.message);
    return res.status(500).send({
      success: false,
      message: "Failed to update candidate assessment status",
      error: error.message,
    });
  }
});



app.post('/fetch-content', (req, res) => {
  const { sections } = req.body;
  const content = sections.map(section => ({
    title: `Content for ${section}`,
    body: `This is the body content for section ${section}` 
  })
)
  res.json(content);
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ashrafshaik250@gmail.com',
    pass: 'jqez anin fafs gizf'
  }
});

// const encrypt = (text, secretKey) => {
//   return CryptoJS.AES.encrypt(text, secretKey).toString();
// };




// const generateOTP = () => {
//   // Generate a unique secret (store it securely for each user)
//   const secret = authenticator.generateSecret();
  
//   // Generate the TOTP based on the secret
//   const otp = authenticator.generate(secret);

//   return { otp, secret }; // Return both OTP and secret
// };
const encrypt = (text, secretKey) => {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encodeURIComponent(encrypted); // Make it URL-safe
}

function generateOTP(candidateId, interval = 180) {
  try {
    const time = Math.floor(Date.now() / 1000 / interval);
    const secret = `${candidateId}${process.env.HMAC_SECRET || 'default-secret'}`;
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(Buffer.from(time.toString()));
    const hash = hmac.digest('hex');
    const offset = parseInt(hash[hash.length - 1], 16);
    const binary = parseInt(hash.substr(offset * 2, 8), 16) & 0x7fffffff;

    // Generate a 4-digit OTP
    const otp = binary % 10 ** 4;
    return otp.toString().padStart(4, '0'); // Ensures OTP is always 4 digits
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw new Error('Unable to generate OTP');
  }
}


app.post('/verify-otp', async (req, res) => {
  const { candidateId, scheduledAssessmentId, otp } = req.body;
console.log("req body",req.body)
  // Check for missing fields
  if (!candidateId || !scheduledAssessmentId || !otp) {
    return res.status(400).json({ 
      isValid: false, 
      message: 'Missing required fields.' 
    });
  }

  try {
    // Check if OTP exists in the database
    const storedOtp = await Otp.findOne({ candidateId, scheduledAssessmentId });
    console.log("stored otp",storedOtp)
    if (!storedOtp) {
      return res.status(404).json({ 
        isValid: false, 
        message: 'OTP not found. Please request a new one.' 
      });
    }

    // Check if OTP has expired
    if (new Date() > storedOtp.expiresAt) {
      return res.status(410).json({ 
        isValid: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }

    // Validate OTP
    const isValid = String(storedOtp.otp) === String(otp); // Ensure type safety

    if (isValid) {
      // Delete OTP after successful validation
      await Otp.findByIdAndDelete(storedOtp._id);

      return res.status(200).json({ 
        isValid: true, 
        message: 'OTP is valid.' 
      });
    } else {
      return res.status(400).json({ 
        isValid: false, 
        message: 'Invalid OTP.' 
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);

    return res.status(500).json({ 
      isValid: false, 
      message: 'Internal server error. Please try again.' 
    });
  }
});

app.post('/resend-link', async (req, res) => {
  const { Email, scheduledAssessmentId } = req.body;

  if (!Email || !scheduledAssessmentId) {
    return res.status(400).json({ message: 'Missing required fields: Email or scheduledAssessmentId' });
  }

  try {
    // Check if the scheduled assessment exists
    const assessment = await scheduledAssessmentsSchema.findById(scheduledAssessmentId);
    if (!assessment) {
      console.error('Assessment not found for ID:', scheduledAssessmentId);
      return res.status(404).json({ message: 'Assessment not found' });
    }

    let candidate;

    // Handle hardcoded Email (for debugging or special cases)
    if (Email === "shashankmende88@gmail.com") {
      candidate = { _id: "678667944d254aa33c527433" };
    } else {
      // Find the candidate by Email
      candidate = await Candidate.findOne({ Email });
      if (!candidate) {
        console.error('Candidate not found for email:', Email);
        return res.status(404).json({ message: 'Candidate not found' });
      }
    }

    // Fetch and update the OTP for the candidate and assessment
    const otp = generateOTP(candidate._id); // Generate a new OTP
    // Try updating the OTP document
    let updatedOtp = await Otp.findOneAndUpdate(
      { scheduledAssessmentId, candidateId: candidate._id }, // Match both fields
      { otp }, // Update the OTP field
      { new: true } // Return the updated document
    );

    // If no OTP document is found, create a new one
    if (!updatedOtp) {
      console.log('No existing OTP document found. Creating a new one.');
      updatedOtp = await Otp.create({
        scheduledAssessmentId,
        candidateId: candidate._id,
        otp,
        expiresAt:new Date(Date.now()+90*1000)
      });
    }

    // Generate the assessment link
    const link = `http://localhost:3000/assessmenttest?assessmentId=${scheduledAssessmentId}&candidateId=${candidate._id}`;

    // Email options
    const mailOptions = {
      from: 'ashrafshaik250@gmail.com',
      to: Email,
      subject: 'Assessment Invitation',
      text: `You have been invited to participate in an assessment. Use this link: ${link}. Your OTP is ${updatedOtp.otp}, valid for 90 seconds.`,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', Email);
      return res.status(200).json({ message: 'Email re-sent successfully' });
    } catch (emailError) {
      console.error('Error sending email to:', Email, emailError);
      return res.status(500).json({ message: 'Failed to send email', error: emailError.message });
    }
  } catch (error) {
    console.error('Error processing resend-link request:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



app.post('/send-assessment-link', async (req, res) => {
  const { scheduledAssessmentId, candidateEmails } = req.body;
  // const notes = "notes text";

  try {
    const assessment = await scheduledAssessmentsSchema.findById(scheduledAssessmentId);
    if (!assessment) {
      console.error('Assessment not found for ID:', scheduledAssessmentId);
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const uniqueEmails = new Set([...candidateEmails, "shashankmende88@gmail.com"]);
    // const uniqueEmails = new Set([...candidateEmails, "shashankmende88@gmail.com","shashankyadavmende79@gmail.com"]);
    // const secretKey = 'test';
    const secretKey = process.env.SECRET_KEY || 'test-secret';
    


    for (const email of uniqueEmails) {
      
      
       const candidate = await Candidate.findOne({ Email: email });
        if (!candidate) {
          console.error('Candidate not found for email:', email);
          
        }
    
      const otp= generateOTP(candidate._id)
      // const expiresAt = new Date(new Date()+90*1000)
      const expiresAt = new Date(Date.now() + 90 * 1000);

      await Otp.create({scheduledAssessmentId,candidateId:candidate._id,otp,expiresAt})
      let encryptedAssessmentId, encryptedCandidateId;
      try {
        encryptedAssessmentId = encrypt(scheduledAssessmentId, secretKey);
        encryptedCandidateId = encrypt(candidate._id, secretKey);
      } catch (encryptionError) {
        console.error('Encryption failed for email:', email, encryptionError);
        continue;
      }

      // const link = `http://localhost:3000/assessmenttest?assessmentId=${encryptedAssessmentId}&candidateId=${encryptedCandidateId}`;
      const link = `http://localhost:3000/assessmenttest?assessmentId=${scheduledAssessmentId}&candidateId=${candidate._id}`;
      const mailOptions = {
        from: 'ashrafshaik250@gmail.com',
        to: email,
        subject: 'Assessment Invitation',
        text: `You have been invited to participate in an assessment. Use this link: ${link}. Your OTP is ${otp}, valid for 90 seconds.`,
      };
      

      console.log('Sending email with options:', mailOptions);

      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
      } catch (emailError) {
        console.error('Error sending email to:', email, emailError);
      }
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});


app.get('/assessment-details/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId).populate('Sections.Questions');
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.status(200).json(assessment); 
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

app.get('/candidate/:candidateId', async (req, res) => {
  const { candidateId } = req.params;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    res.status(500).json({ error: 'Error fetching candidate data', message: error.message });
  }
});


app.get('/position/:positionId', async (req, res) => {
  const { positionId } = req.params;
  try {
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(position);
  } catch (error) {
    console.error('Error fetching position data:', error);
    res.status(500).json({ error: 'Error fetching position data', message: error.message });
  }
});




ConnectDb().then(() => {
  app.listen(PORT, () => console.log("server is running at :", PORT));
});
