
const express = require('express')
const formidable = require('formidable')
const { addPosition, getPositions, getPositionById, updatePositionById } = require('../controllers/position')
const { addSkills, getSkills } = require('../controllers/skillsMaster')
const { addTechnology, getTechnologyWithSkills, getAllTechs } = require('../controllers/technologyMaster')
const { addEducationItem, getEducation } = require('../controllers/education')
const { addCollege, getColleges } = require('../controllers/college')
const { addCandidate, getCandidate, getCandidateBasedOnPosition, getCandidateBasedOnId, updateCandidateById } = require('../controllers/candidate')

const router = express.Router()


router.post('/position',addPosition)

router.get('/position',getPositions)

router.get('/position/:id',getPositionById)

router.put('/position/:id',updatePositionById)
//skills master 

router.post('/add-skill',addSkills)

router.get('/get-skills',getSkills)


router.post("/add-tech",addTechnology)

router.get('/get-tech/:id',getTechnologyWithSkills)

router.get('/tech',getAllTechs)


//education routes

router.post('/education',addEducationItem)

router.get('/education',getEducation)


//college routes
router.post('/college',addCollege)

router.get('/college',getColleges)

module.exports = router

//candidate routes
router.post('/candidate',addCandidate)
// router.post('/candidate',formidable(),addCandidate)

router.get('/candidate',getCandidate)

router.get('/candidate/:title',getCandidateBasedOnPosition)

router.get('/candidate/id/:id',getCandidateBasedOnId)

router.put('/candidate/update/:id',updateCandidateById)