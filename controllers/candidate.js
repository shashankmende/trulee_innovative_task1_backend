
const Candidate = require('../models/candidate')
const fs = require('fs')
const multer = require('multer')
const path= require('path')

function ensureDirectoryExists(directoryPath){
    if (!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath,{recursive:true})
    }
}


const storage = multer.diskStorage({
    destination: (req,file,db)=>{
        const uploadPath = path.join(__dirname,"../public/images")
        ensureDirectoryExists(uploadPath)
        cb(null,uploadPath)
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage,
    limits:{fileSize:5*1024*1024},
    fileFilter: (req,file,cb)=>{
        const allowedTypes= ["image/jpeg", "image/png","image/gif"]
        if (allowedTypes.includes(file.mimetype)){
            cb(null,true)
        }
        else{
            cb(new Error("Invalid file type"),false)
        }
    }
})

const uploadImage = (req,res)=>{
    if (!req.file){
        return res.status(400).send({message:"No file uploaded"})
    }
    const imagePath = `/images/${req.file.filename}`
    res.send({message:"Image uploaded successfully",imagePath})
}

const addCandidate = async(req,res)=>{
    try {
        const {firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,positionId,skills,photo}=req.body 
        if (!lastName){
            return res.status(400).send({message:"last name is required"})
        }
        if (!firstName){
            return res.status(400).send({message:"FIrst name  is required"})
        }
        if (!phone){
            return res.status(400).send({message:"phone  is required"})
        }
        if (!dateOfBirth){
            return res.status(400).send({message:"dateOfBirth  is required"})
        }
        if (!email){
            return res.status(400).send({message:"email  is required"})
        }
        if (!gender){
            return res.status(400).send({message:"dateOfBirth  is required"})
        }
        if (!higherQualification){
            return res.status(400).send({message:"Higher Qualification  is required"})
        }
        if (!college){
            return res.status(400).send({message:"college  is required"})
        }
        if (!experience){
            return res.status(400).send({message:"experience  is required"})
        }
        if (!position){
            return res.status(400).send({message:"position  is required"})
        }
        if (!skills){
            return res.status(400).send({message:"college  is required"})
        }
        if (!positionId){
            return res.status(400).send({message:"positionId  is required"})
        }
        
        const candidate = await Candidate({
            firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,positionId,skills,photo
        })

        await candidate.save()
        return res.status(201).send({
            success:true,
            message:"Candidate Added",
            candidate
        })
        
    } catch (error) {
        console.log("Error in adding candidate",error)
        return res.status(500).send({
            success:false,
            message:"Failed to add candidate",
            error
        })
    }
}


const getCandidate = async(req,res)=>{
    try {
        const candidates = await Candidate.find()
        return res.status(200).send({
            success:true,
            message:"Candidates retrieved successfully",
            candidates
        })
    } catch (error) {
        console.log("Error in getting candidate")
        return res.status(500).send({
            message:"Failed to get candidate",
            success:false,
            error
        })
    }
}

const getCandidateBasedOnId = async(req,res)=>{
    try {
        const {id}=req.params
        const candidate = await Candidate.findOne({_id:id})
        return res.status(200).send({
            success:true,
            message:"Candidate retrieved based on id",
            candidate
        })
    } catch (error) {
        console.log("error in getting candidate based on id",error)
        return res.status(500).send({
            message:"Failed to get candidate based on id",
            success:false,
            error
        })
    }
}

const getCandidateBasedOnPosition = async(req,res)=>{
    try {
        const {id}=req.params 
        console.log(id)
        const candidate = await Candidate.find({positionId:id})
        console.log(candidate)
        return res.status(200).send({
            message:"Candidate retrieved based on position",
            success:true,
            candidate
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Failed to get candidates based on title",
            error
        })
    }
}


const updateCandidateById = async(req,res)=>{
    try {
        const {id}=req.params
        const {firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills}=req.body 
        const candidate = await Candidate.findByIdAndUpdate({_id:id},{
            firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills
        })
        return res.status(200).send({
            success:true,
            message:"Candidate updated successfullly",
            candidate
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Failed to update candidate",
            error
        })
    }
}

module.exports = {uploadImage,addCandidate,getCandidate,getCandidateBasedOnPosition,getCandidateBasedOnId,updateCandidateById}