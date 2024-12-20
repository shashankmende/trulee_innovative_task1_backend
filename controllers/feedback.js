
const FeedbackModel = require('../models/feedback')

const createFeedback =async(req,res)=>{
    try {
        const {Candidate,Questions,Skills,OverallImpression}= req.body
        const FeedbackInstance = await FeedbackModel({Candidate,Questions,Skills,OverallImpression})
        console.log('response',FeedbackInstance)
        await FeedbackInstance.save()

        return res.status(201).send({
            success:true,
            message:"Feedback added"
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={createFeedback}