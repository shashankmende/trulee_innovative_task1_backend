


const express = require('express')
// const { createQuestion, getQuestions } = require('../controllers/suggestedQuestions')
const { getSuggestedQuestionsSkills } = require('../controllers/suggestedQuestionsSkill')

const router = express.Router()


router.get('/skills',getSuggestedQuestionsSkills)

module.exports = router