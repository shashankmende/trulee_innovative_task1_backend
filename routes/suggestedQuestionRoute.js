
const express = require('express')
const { createQuestion, getQuestions } = require('../controllers/suggestedQuestions')

const router = express.Router()

router.get('/test',(req,res)=>{
    console.log('we are in suggested question controller')
    return res.send("we are in suggested questions route")
})

router.post('/create',createQuestion)
router.get('/questions',getQuestions)

module.exports = router