
require('dotenv').config()

const express = require('express')
const ConnectDb = require("./utils/db")
const router = require('./routes/positionsRoutes')
const cors = require('cors')



const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/',router)


ConnectDb().then(()=>{
    app.listen(PORT,()=>console.log('server is running at :',PORT))
})

