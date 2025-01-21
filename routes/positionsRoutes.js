
// const express = require('express')
// const formidable = require('formidable')
// const { addPosition, getPositions, getPositionById, updatePositionById, getPositionsBasedOnPositionId } = require('../controllers/position')
// const { addSkills, getSkills } = require('../controllers/skillsMaster')
// const { addTechnology, getTechnologyWithSkills, getAllTechs } = require('../controllers/technologyMaster')
// const { addEducationItem, getEducation } = require('../controllers/education')
// const { addCollege, getColleges } = require('../controllers/college')
// // const { addCandidate, getCandidate, getCandidateBasedOnPosition, getCandidateBasedOnId, updateCandidateById, uploadImage } = require('../controllers/candidate')
// const fs = require('fs')
// const path = require('path')
// const multer = require('multer')
// const { createTicket, getTicket } = require('../controllers/ticket')
// const router = express.Router()


// const upload = multer({
//     storage: multer.diskStorage({
//       destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, "../public/images");
//         ensureDirectoryExists(uploadPath);
//         cb(null, uploadPath);
//       },
//       filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//       },
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
//       if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(new Error("Invalid file type"), false);
//       }
//     },
//   });

//   function ensureDirectoryExists(directoryPath) {
//     if (!fs.existsSync(directoryPath)) {
//       fs.mkdirSync(directoryPath, { recursive: true });
//     }
//   }

// router.post('/position',addPosition)

// router.get('/position',getPositions)

// router.get('/position/:id',getPositionById)

// router.put('/position/:id',updatePositionById)

// router.get('/candidate/position/:id',getPositionsBasedOnPositionId)

// //skills master 

// router.post('/add-skill',addSkills)

// router.get('/get-skills',getSkills)


// router.post("/add-tech",addTechnology)

// router.get('/get-tech/:id',getTechnologyWithSkills)

// router.get('/tech',getAllTechs)


// //education routes

// router.post('/education',addEducationItem)

// router.get('/education',getEducation)


// //college routes
// router.post('/college',addCollege)

// router.get('/college',getColleges)

// module.exports = router

// //candidate routes
// // router.post('/candidate',addCandidate)
// // router.post('/candidate',formidable(),addCandidate)

// router.post('/candidate/uploadImage',upload.single('photo'),uploadImage)

// router.get('/candidate',getCandidate)

// router.get('/candidate/:id',getCandidateBasedOnPosition)

// router.get('/candidate/id/:id',getCandidateBasedOnId)

// router.put('/candidate/update/:id',updateCandidateById)


// //ticket routes

// router.post('/create-ticket',createTicket)

// router.get('/get-tickets',getTicket)