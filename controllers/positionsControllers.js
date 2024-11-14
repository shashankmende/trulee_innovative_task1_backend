const PositionModel = require("../models/positions")

const addPosition = async(req,res)=>{

    try {

        const {title,company,jobDescription,experience,skills,additionalNotes,rounds}=req.body
        console.log(req.body)
        const positionInstance = await PositionModel({
            title,
            company,
            jobDescription,
            experience,
            skills,
            additionalNotes,
            rounds

        })
        await positionInstance.save()
        res.status(201).send({
            success:true,
            message:"Position Added",
            postion:positionInstance
        })

    } catch (error) {

        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Adding position",
            error
        })
        
    }
}


const getPositions = async(req,res)=>{
    try {
        const positions = await PositionModel.find()
        res.status(200).send({
            message:"Retrieved positions",
            success:true,
            positions
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in retrieving position",
            error
        })
    }
}

module.exports = {addPosition,getPositions}