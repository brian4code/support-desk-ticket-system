import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useParams, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import Modal from 'react-modal'
import {FaPlus} from 'react-icons/fa'
import {getTicket, closeTicket} from '../features/tickets/ticketSlice'
import {getNotes, createNote, reset as notesReset} from '../features/notes/noteSlice'
import BackButton from '../compnents/BackButton'
import Spinner from '../compnents/Spinner'
import NoteItem from '../compnents/NoteItem'

// display single ticket detail page 
// can open a pop up Modal to add notes to the ticket 
// can click button to close a ticket 

// set styles for pop up Modal 
const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
  }
}

Modal.setAppElement('#root')


function Ticket() {
  // set local state
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  // get global state
  const {ticket, isLoading, isSuccess, isError, message} = 
    useSelector((state) => state.tickets)

  const {notes, isLoading: notesIsLoading} = 
    useSelector((state) => state.notes)

  const {ticketId} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
    // eslint-disable-next-line
  }, [isError, message, ticketId])

  // Close ticket button
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
    toast.success('Ticket Closed')
    navigate('/tickets')
  }

  // Create note submit
  const onNoteSubmit = (e) => {
    e.preventDefault()
    dispatch(createNote({noteText, ticketId}))
    setNoteText('')
    closeModal()
  }

  // Open / Close modal function
  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isLoading || notesIsLoading) {
    return <Spinner />
  }

  if (isError) {
    return <h3>Something went wrong</h3>
  }
  
  return (
    <div className='ticket-page'>
      <header className="ticket-header">
        <BackButton url='/tickets' />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>
          Product: {ticket.product}
        </h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== 'closed' && (
        <button onClick={openModal} className="btn">
          <FaPlus /> Add Note
        </button>
      )}

      {/* open Pop up Modal to add notes */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Add Note'
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>

        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea 
              name="noteText"
              id="noteText"
              className='form-control'
              placeholder='Note text'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type='submit'>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* display notes */}
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== 'closed' && (
        <button className="btn btn-block btn-danger" onClick={onTicketClose}>
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket