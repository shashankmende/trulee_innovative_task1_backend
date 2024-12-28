const { Skills } = require("../models/suggestedQuestionsSkills");




const getSuggestedQuestionsSkills = async(req,res)=>{
    try {
        const skills = await Skills.find({});
        res.json(skills);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

module.exports = {getSuggestedQuestionsSkills}
// app.get('/skills', async (req, res) => {
//     try {
//       const skills = await Skills.find({});
//       res.json(skills);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });