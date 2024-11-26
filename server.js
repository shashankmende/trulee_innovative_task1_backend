
require('dotenv').config()

const express = require('express')
const ConnectDb = require("./utils/db")
const router = require('./routes/positionsRoutes')
const cors = require('cors')
const path = require('path')



const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/',router)
app.use('/images',express.static(path.join(__dirname,'public/images')))


ConnectDb().then(()=>{
    app.listen(PORT,()=>console.log('server is running at :',PORT))
})

