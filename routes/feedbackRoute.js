

const express = require('express')
const { createFeedback } = require('../controllers/feedback')

const router = express.Router()

router.get("/feedback-get",(req,res)=>{
    return res.send("we are in feedback controller")
})

router.post('/create',createFeedback)

module.exports =router 
 