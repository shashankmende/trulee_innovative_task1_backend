const HigherEducationMaster = require("../models/HigherEducationMaster")


const addEducationItem = async(req,res)=>{
    try {
        const {name}=req.body 
        if (!name){
            return res.status(400).send({message:"Education name is required"})

        }
        const education = await HigherEducationMaster({name})
        await education.save()
        return res.status(201).send({
            success:true,
            message:"Education added",
            education
        })
    } catch (error) {
        console.log("Error in adding education",error)
        return res.status(500).send({
            success:false,
            message:"Failed to add education",
            error
        })
    }
}

const getEducation = async(req,res)=>{
    try {
        const educations = await HigherEducationMaster.find()
        return res.status(200).send({
            success:true,
            message:"Educations retrieved successfully",
            educations
        })
    } catch (error) {
        console.log("Error in getting education",error)
        return res.status(500).send({
            success:false,
            message:"Failed to get education",
            error
        })
    }
}


module.exports = {addEducationItem,getEducation}