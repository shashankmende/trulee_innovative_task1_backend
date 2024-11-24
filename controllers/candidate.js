
const Candidate = require('../models/candidate')

const addCandidate = async(req,res)=>{
    try {
        const {firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills,image}=req.body 
        if (!lastName){
            return res.status(400).send({message:"last name is required"})
        }
        // if (!dateOfBirth){
        //     return res.status(400).send({message:"dateOfBirth  is required"})
        // }
        if (!phone){
            return res.status(400).send({message:"phone  is required"})
        }
        // if (!dateOfBirth){
        //     return res.status(400).send({message:"dateOfBirth  is required"})
        // }
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
        
        const candidate = await Candidate({
            firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills,image
        })

        await candidate.save()
        return res.status(201).send({
            success:true,
            message:"Candidate Added",
            candidate
        })
        
    } catch (error) {
        console.log("Error in adding candidate")
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

module.exports = {addCandidate,getCandidate}