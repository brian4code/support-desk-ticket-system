const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

const app = express()

// include body parser 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve Backend Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// Serve Frontend 
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // Serve Frontend index.html file
  app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API'})
    // res.json({ message: 'hello' })
  })
}


app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
