

exports.addSection = async(req,res)=>{
    try {
      const section = await Section(req.body)
      res.status(201).send({success:true,message:"Section Added",section})
    } catch (error) {
      res.status(500).send({success:false,message:"Failed to add section",error:error.message})
    }
  }