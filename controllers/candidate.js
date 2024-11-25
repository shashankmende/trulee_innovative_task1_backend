
const Candidate = require('../models/candidate')

const addCandidate = async(req,res)=>{
    try {
        const {firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills,photo}=req.body 
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
            firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills,photo
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

// const addCandidate = async(req,res)=>{
//     try {
//         const {firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills,photo}=req.body 
//         if (!lastName){
//             return res.status(400).send({message:"last name is required"})
//         }
//         // if (!dateOfBirth){
//         //     return res.status(400).send({message:"dateOfBirth  is required"})
//         // }
//         if (!phone){
//             return res.status(400).send({message:"phone  is required"})
//         }
//         // if (!dateOfBirth){
//         //     return res.status(400).send({message:"dateOfBirth  is required"})
//         // }
//         if (!email){
//             return res.status(400).send({message:"email  is required"})
//         }
//         if (!gender){
//             return res.status(400).send({message:"dateOfBirth  is required"})
//         }
//         if (!higherQualification){
//             return res.status(400).send({message:"Higher Qualification  is required"})
//         }
//         if (!college){
//             return res.status(400).send({message:"college  is required"})
//         }
//         if (!experience){
//             return res.status(400).send({message:"experience  is required"})
//         }
//         if (!position){
//             return res.status(400).send({message:"position  is required"})
//         }
//         if (!skills){
//             return res.status(400).send({message:"college  is required"})
//         }
        
//         const candidate = await Candidate({
//             firstName,lastName,dateOfBirth,phone,email,gender,higherQualification,college,experience,position,skills,image,photo
//         })

//         await candidate.save()
//         return res.status(201).send({
//             success:true,
//             message:"Candidate Added",
//             candidate
//         })
        
//     } catch (error) {
//         console.log("Error in adding candidate")
//         return res.status(500).send({
//             success:false,
//             message:"Failed to add candidate",
//             error
//         })
//     }
// }


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
        const {title}=req.params 
        console.log(title)
        const candidate = await Candidate.find({position:title})
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

module.exports = {addCandidate,getCandidate,getCandidateBasedOnPosition,getCandidateBasedOnId,updateCandidateById}