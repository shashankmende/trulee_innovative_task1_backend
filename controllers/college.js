
const College = require("../models/college")


const addCollege = async(req,res)=>{
    try {
        const {name}=req.body 
        if (!name){
            return res.status(400).send({message:"College is required"})

        }
        const college = await College({name})
        await college.save()
        return res.status(201).send({
            success:true,
            message:"College added",
            college
        })
    } catch (error) {
        console.log("Error in adding college",error)
        return res.status(500).send({
            success:false,
            message:"Failed to add college",
            error
        })
    }
}

const getColleges = async(req,res)=>{
    try {
        const colleges = await College.find()
        return res.status(200).send({
            success:true,
            message:"Colleges retrieved successfully",
            colleges
        })
        
    } catch (error) {
        console.log('Error in getting colleges')
        return res.status(500).send({
            success:false,
            message:"Failed to get colleges",
            error
        })
    }
}


module.exports = {addCollege,getColleges}