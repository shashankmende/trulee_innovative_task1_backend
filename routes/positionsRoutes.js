
const express = require('express')
const { addPosition, getPositions } = require('../controllers/positionsControllers')

const router = express.Router()

router.get("/",(req,res)=>{
    res.send("Hello world")
})


router.post('/position',addPosition)

router.get('/position',getPositions)

module.exports = router