const { Candidate } = require("../models/candidate");
const { CandidateAssessment } = require("../models/candidateAssessment");
const Otp = require("../models/Otp");
const scheduledAssessmentsSchema = require("../models/scheduledAssessmentsSchema");


exports.SendLink = async (req, res) => {
    const { scheduledAssessmentId, candidateEmails } = req.body;
    // const notes = "notes text";
  
    try {
      const assessment = await scheduledAssessmentsSchema.findById(
        scheduledAssessmentId
      );
      if (!assessment) {
        console.error("Assessment not found for ID:", scheduledAssessmentId);
        return res.status(404).json({ message: "Assessment not found" });
      }
  
      const secretKey = process.env.SECRET_KEY || "test-secret";
  
      for (const email of candidateEmails) {
        const candidate = await Candidate.findOne({ Email: email });
        if (!candidate) {
          console.error("Candidate not found for email:", email);
        }
  
        const candidateAssessmentDetails = await CandidateAssessment.findOne({candidateId:candidate._id,scheduledAssessmentId})
        console.log("candidateAssessmentDetails",candidateAssessmentDetails)
  
        const otp = generateOTP(candidate._id);
        const expiresAt = new Date(Date.now() + 90 * 1000);
  
        await Otp.create({
          scheduledAssessmentId, 
          candidateId: candidate._id,
          otp, 
          expiresAt,
        });
  
        const encryptedId =  encrypt(candidateAssessmentDetails._id.toString(),'test')
        // const link = `http://localhost:3000/assessmenttest?assessmentId=${scheduledAssessmentId}&candidateId=${candidate._id}&candidateAssessmentId=${candidateAssessmentDetails._id}`;
        // const link = `http://localhost:3000/assessmenttest?candidateAssessmentId=${candidateAssessmentDetails._id}`;
        const link = `http://localhost:3000/assessmenttest?candidateAssessmentId=${encryptedId}`;
        const updateCandidateAssessments = await CandidateAssessment.findByIdAndUpdate(candidateAssessmentDetails._id,{assessmentLink:link},{new:true})
  console.log("updateCandidateAssessments ",updateCandidateAssessments)
        const mailOptions = {
          from: "ashrafshaik250@gmail.com",
          to: email,
          subject: "Assessment Invitation",
          text: `You have been invited to participate in an assessment. Use this link: ${link}. Your OTP is ${otp}, valid for 90 seconds.`,
        };
  
        console.log("Sending email with options:", mailOptions);
  
        try {
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully to:", email);
        } catch (emailError) {
          console.error("Error sending email to:", email, emailError);
        }
      }
  
      res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ message: "Error sending email", error: error.message });
    }
  }