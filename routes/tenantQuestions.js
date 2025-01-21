
const express = require("express")
const { newQuestion, getFormattedQuestions } = require("../controllers/myQuestionsList")

const router = express.Router()

//base: /tenant
router.post('/newquestion',newQuestion)

router.get('/questions',getFormattedQuestions)

module.exports = router