const mongoose = require('mongoose');





const FeedSchema = new mongoose.Schema({


    tenantId: { type: String, required: true },   // Tenant reference 


    feedType: { type: String, enum: ["info", "alert", "update"], required: true }, // Type of feed 


    action: { type: String, required: true },   // Action performed (e.g., "feedback_submitted", "interview_scheduled") 


    ownerId: { type: String, required: true }, //Owner Id 


    parentId: { type: String, required: true }, //ObjectId 


    parentObject: { type: String, required: true }, //Object Name 


    metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data about the feed (e.g., question details, feedback ratings) 


    message: { type: String, required: true },       // Readable feed description (e.g., "Interview scheduled with John Doe") 


    history: [


        {


            fieldName: { type: String },


            oldValue: { type: mongoose.Schema.Types.Mixed },


            newValue: { type: mongoose.Schema.Types.Mixed },


        }


    ],


    severity: { type: String, required: false }, //"low", "medium", "high" 


    createdAt: { type: Date, default: Date.now },


},


    { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields 





module.exports = mongoose.model('Feed', FeedSchema);