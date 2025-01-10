const skillsMaster = require("../models/skills")


const addSkills = async(req,res)=>{
    try {
        const {name}=req.body 
        if (!name){
            return res.send({message:"Name is required"})
        }
        const skill = await skillsMaster.create({name})
        return res.status(201).send({
            success:true,
            message:"Skill added",
            skill
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error while adding skill",
            error
        })
    }

}

const getSkills = async(req,res)=>{
    try {
        const skills = await skillsMaster.find()
        return res.status(200).send({
            success:true,
            message:"skills retrieved",
            skills
        })
    } catch (error) {
        console.log("error in retrieving skills")
        return res.status(500).send({
            success:false,
            message:"Something went wrong",
            error

        })
    }
}


module.exports = {addSkills,getSkills}