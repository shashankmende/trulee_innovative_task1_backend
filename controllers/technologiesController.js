const skillsMaster = require("../models/skillsMaster");
const technologiesMaster = require("../models/technologiesMaster");

const addTechnology = async(req,res)=>{
    try {
        const {name,skills}=req.body 
        if (!name || !skills || !Array.isArray(skills)){
            
            
            return res.status(400).send({message:"Technology and name are required"})

        }

        let skillIds = [];
        for (let skillName of skills){
            if (!skillName.name) continue
            let skill = await skillsMaster.findOne({name:skillName.name})
            if (!skill){
                
                skill  = await skillsMaster.create({name:skillName.name})
            }
            skillIds.push(skill._id)
        }

        const technology = new technologiesMaster({
            name,
            skills:skillIds
        })
        await technology.save()
        return res.status(201).send({
            message:"Technology and skills created successfully",
            technology,
            success:true
        })

    } catch (error) {
        console.log("error in creating technology",error)
        return res.status(500).send({
            message:"Failed to create technology",
            success:false,
            error
        })
    }
}


const getTechnologyWithSkills = async(req,res)=>{
    try {
        const {id}=req.params 
        console.log(id)
        const tech = await technologiesMaster.findOne({_id:id}).populate('skills')
        return res.status(200).send({
            success:true,
            message:"Retrieved successfully",
            technology:tech
        })
        
    } catch (error) {
        console.log("error in retrieving technology",error)
        return res.status(200).send({
            success:false,
            message:"Erro in Retrieving",
            error
        })
    }
}

const getAllTechs = async(req,res)=>{
    try {
        // const tech = await technologiesMaster.find().select("-skills -createdAt -updatedAt")
        const tech = await technologiesMaster.find().populate('skills')
        return res.status(200).send({
            success:true,
            message:"Retrieved All techs",
            technology:tech
        })
    } catch (error) {
        console.log("Error in retrieving all techs")
        return res.status(500).send({
            success:false,
            message:"Error in retrieving all techs",
            error
        })
    }
}

module.exports = {addTechnology,getTechnologyWithSkills,getAllTechs}