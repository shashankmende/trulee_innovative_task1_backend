

exports.getQualifications =  async (req, res) => {
    try {
      const higherqualifications = await HigherQualification.find({}, 'QualificationName');
      res.json(higherqualifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }