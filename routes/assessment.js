
const mongoose = require("mongoose")
const express = require("express")
const { newAssessment, updateAssessment } = require("../controllers/assessment")

const router = express.Router()

router.post('/new-assessment',newAssessment)

router.patch('/update-assessment/:id',updateAssessment)

module.exports = router