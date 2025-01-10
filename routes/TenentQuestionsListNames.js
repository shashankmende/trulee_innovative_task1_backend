

const express = require('express')
const { createList, getList, updateList } = require('../controllers/TenentQuestionsListNames')
const router = express.Router()

router.post('/lists',createList)

router.get('/lists/:userId',getList)

router.put('/lists/:id',updateList)

module.exports = router