
require('dotenv').config()

const express = require('express')
const ConnectDb = require("./utils/db")
const router = require('./routes/positionsRoutes')
const ticketRouter = require('./routes/ticketsRoute')
const feedbackRouter = require('./routes/feedbackRoute')
const suggestedQuestionRouter = require('./routes/suggestedQuestionRoute')
const suggestedQuestionsSKillsRoute = require('./routes/suggestedQuestionsSkillsRoute')
const cors = require('cors')
const path = require('path')



const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/',router)
app.use('/ticket/',ticketRouter)
app.use('/images',express.static(path.join(__dirname,'public/images')))
app.use('/feedback',feedbackRouter)
app.use('/suggested-questions',suggestedQuestionRouter)
app.use('/skills',suggestedQuestionsSKillsRoute)

ConnectDb().then(()=>{
    app.listen(PORT,()=>console.log('server is running at :',PORT))
})

