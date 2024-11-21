
const express = require('express')
const { addSkills } = require('../controllers/skillsMasterController')

const router = express.Router()

router.post('/add-skill',addSkills)
