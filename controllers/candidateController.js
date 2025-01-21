const { Candidate } = require('../models/candidate');


exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error });
  }
};

exports.createCandidate = async (req, res) => {
   // Mark that logging will be handled by the controller
   res.locals.loggedByController = true;
  try {
    const { FirstName, LastName, Email, Phone, Date_Of_Birth, Gender, HigherQualification, UniversityCollege, CurrentExperience, skills, PositionId, ownerId, tenantId, CreatedBy } = req.body;

    if (!ownerId) {
      return res.status(400).json({ error: "OwnerId field is required" });
    }

    const newCandidate = new Candidate({
      FirstName,
      LastName,
      Email,
      Phone,
      Date_Of_Birth,
      Gender,
      HigherQualification,
      UniversityCollege,
      CurrentExperience,
      skills,
      PositionId,
      ownerId,
      tenantId,
      CreatedBy,
      CreatedDate: new Date()
    });

    await newCandidate.save();
   // Set response data for logging
   res.locals.responseData = {
    status: 'success',
    message: 'Candidate created successfully',
    data: newCandidate,
  };

  res.status(201).json(res.locals.responseData);
  } catch (error) {
    // Set error response data for logging
    res.locals.responseData = {
      status: 'error',
      message: error.message,
    };

    res.status(500).json(res.locals.responseData);
  }
};

// Update only the modified fields of a candidate
exports.updateCandidate = async (req, res) => {
  const candidateId = req.params.id;
  const {
    FirstName,
    LastName,
    Email,
    Phone,
    Date_Of_Birth,
    Gender,
    HigherQualification,
    UniversityCollege,
    CurrentExperience,
    skills,
    PositionId,
    LastModifiedById,
    tenantId,
  } = req.body;

  const updateFields = {};

  // Only add the fields that are present in the request body
  if (FirstName) updateFields.FirstName = FirstName;
  if (LastName) updateFields.LastName = LastName;
  if (Email) updateFields.Email = Email;
  if (Phone) updateFields.Phone = Phone;
  if (Date_Of_Birth) updateFields.Date_Of_Birth = Date_Of_Birth;
  if (Gender) updateFields.Gender = Gender;
  if (HigherQualification) updateFields.HigherQualification = HigherQualification;
  if (UniversityCollege) updateFields.UniversityCollege = UniversityCollege;
  if (CurrentExperience) updateFields.CurrentExperience = CurrentExperience;
  if (skills) updateFields.skills = skills;
  if (PositionId) updateFields.PositionId = PositionId;
  if (LastModifiedById) updateFields.LastModifiedById = LastModifiedById;
  // if (tenantId) updateFields.tenantId = tenantId;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      updateFields,
      { new: true } // Return the updated candidate document
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.locals.responseData = {
      status: 'success',
      message: 'Candidate created successfully',
      data: updatedCandidate,
    };

    res.status(201).json(res.locals.responseData);
  } catch (error) {
    // Set error response data for logging
    res.locals.responseData = {
      status: 'error',
      message: error.message,
    };

    res.status(500).json(res.locals.responseData);
  }
};



exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
