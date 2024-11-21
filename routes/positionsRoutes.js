
const express = require('express')
const { addPosition, getPositions, getPositionById, updatePositionById } = require('../controllers/positionsControllers')
const { addSkills, getSkills } = require('../controllers/skillsMasterController')
const { addTechnology, getTechnologyWithSkills, getAllTechs } = require('../controllers/technologiesController')

const router = express.Router()

router.get("/",(req,res)=>{
    res.send("Hello world")
})


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

module.exports = router