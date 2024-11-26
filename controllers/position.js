const PositionModel = require("../models/positions");


const addPosition = async (req, res) => {
  try {
    const {
      title,
      company,
      jobDescription,
      experience,
      skills,
      additionalNotes,
      rounds,
    } = req.body;
    console.log(req.body);
    const positionInstance = await PositionModel({
      title,
      company,
      jobDescription,
      experience,
      skills,
      additionalNotes,
      rounds,
    });
    await positionInstance.save();
    res.status(201).send({
      success: true,
      message: "Position Added",
      position: positionInstance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Adding position",
      error,
    });
  }
};

const getPositions = async (req, res) => {
  try {
    // const positions = await PositionModel.find().populate('skills')
    const positions = await PositionModel.find();
    res.status(200).send({
      message: "Retrieved positions",
      success: true,
      positions: positions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving position",
      error,
    });
  }
};

const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await PositionModel.findOne({ _id: id });

    return res.status(200).send({
      success: true,
      message: "Position Retrieved successfully",
      position,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in retrieving position",
      error,
    });
  }
};

const updatePositionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("update id", id);
    const {
      title,
      company,
      experience,
      skills,
      jobDescription,
      rounds,
      additionalNotes,
    } = req.body;
    const position = await PositionModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        company,
        experience,
        jobDescription,
        skills,
        rounds,
        additionalNotes,
      }
    );
    console.log("position updated");
    return res.status(200).send({
      success: true,
      message: "Position updated",
      position,
    });
  } catch (error) {
    console.log("Error in updating");
    return res.status(500).send({
      success: false,
      message: "Failed to update Position",
      error,
    });
  }
};

const getPositionsBasedOnPositionId = async(req,res)=>{
  try {
      const {id}=req.params 
      const positions = await PositionModel.find({_id:id})
      return res.status(200).send({
          success:true,
          message:"Successfully retrieved candidates based on position id",
          positions
      })
  } catch (error) {
      console.log(error)
      return res.status(500).send({
          success:false,
          message:"Failed to get candidate based on position id",
          error:error.message
      })
  }
}


module.exports = {
  addPosition,
  getPositions,
  getPositionById,
  updatePositionById,
  getPositionsBasedOnPositionId
};
