const mongoose = require('mongoose');

// const ContactsSchema = new mongoose.Schema({
//     name: String,
//     firstname: String,
//     countryCode: String,
//     userId: String,
//     email: String,
//     phone: String,
//     linkedinUrl: String,
//     currentRole: String,
//     industry: { type: String },
//     experience: { type: String },
//     gender: String,
//     imageData: {
//         filename: String,
//         path: String,
//         contentType: String,
//     },
//     timeZone: String,
//     preferredDuration: String,
//     location: String,
//     introduction: String,
//     technology: [String],
//     skill: [String],
//     experienceYears: String,
//     previousExperience: String,
//     isFreelancer: String,
//     expertiseLevel: String,
//     contactType: String,
//     isAddedTeam: String,
//     interviewType: String,
//     availability: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewAvailability' }],
//     // user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
//     createdDate: {
//         type: Date,
//         default: Date.now
//     },
//     createdBy: {
//         type: String,
//     },
//     // ModifiedDate: {
//     //     type: Date,
//     //     default: Date.now
//     // },
//     // ModifiedBy: {
//     //     type: String
//     // }
// });

const ContactsSchema = new mongoose.Schema({
    name: String,
    firstname: String,
    CountryCode: String,
    UserName: String,
    email: String,
    phone: String,
    linkedinUrl: String,
    currentRole: String,
    industry: { type: String },
    experience: { type: String },
    gender: String,
    imageData: {
        filename: String,
        path: String,
        contentType: String,
    },
    timeZone: String,
    preferredDuration: String,
    location: String,
    introduction: String,
    technology: [String],
    password: String,
    contactType: String,
    skills: [
        {
            skill: String,
            experience: String,
            expertise: String,
        },
    ],
    experienceYears: String,
    previousExperience: String,
    isFreelancer: String,
    expertiseLevel: String,
    language: String,
    profileId: String,
    roleId: String,
    contactType: String,
    interviewerType: String,
    isAddedTeam: String,
    interviewType: String,
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    availability: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interviewavailability' }],
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    createdDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
    },
    // ModifiedDate: {
    //     type: Date,
    //     default: Date.now
    // },
    // ModifiedBy: {
    //     type: String
    // }
});


const ContactHistorySchema = new mongoose.Schema({
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contacts' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    Name: String,
    Firstname: String,
    CountryCode: String,
    UserName: String,
    Email: String,
    Phone: String,
    LinkedinUrl: String,
    Gender: String,
    isFreelancer: String,
    ImageData: {
        filename: String,
        path: String,
        contentType: String,
    },
    CurrentRole: String,
    industry: String,
    Experience: String,
    location: String,
    Introduction: String,
    Technology: [String],
    Skill: [String],
    experienceYears: String,
    previousExperience: String,
    expertiseLevel: String,
    CreatedDate: Date,
    CreatedBy: String,
    ModifiedDate: Date,
    ModifiedBy: String,
    updatedAt: { type: Date, default: Date.now }
});

const Contacts = mongoose.model('Contacts', ContactsSchema);
const ContactHistory = mongoose.model('ContactHistory', ContactHistorySchema);

module.exports = {
    Contacts,
    ContactHistory
};