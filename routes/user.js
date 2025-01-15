
const express = require('express')
const { getUserById } = require('../controllers/user')

const router = express.Router()

router.get('/users/:id',getUserById)

router.post('/')