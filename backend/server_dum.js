const { urlencoded } = require('express')
const colors = require('colors')
const express = require('express')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware_dum')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

// Connect to DB
connectDB()

const app = express()

app.use(express.json())
app.use(urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the support desk API'})
})

// Routes
app.use('/api/users', require('./routes/userRoutes_dum'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

