

exports.getUniversityCollegeNames = async (req, res) => {
    try {
      const universityCollegeNames = await University_CollegeName.find({}, 'University_CollegeName');
      res.json(universityCollegeNames);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }