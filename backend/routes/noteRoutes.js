const express = require('express')
const router = express.Router({ mergeParams: true })
const {getNotes, addNote} = require('../controllers/noteController')

const {protect} = require('../middleware/authMiddleware')

// routes for the path - /api/tickets/:ticketId/notes

router.route('/')
  .get(protect, getNotes)
  .post(protect, addNote)

module.exports = router

