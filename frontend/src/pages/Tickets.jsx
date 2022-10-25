import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getTickets, reset} from '../features/tickets/ticketSlice'
import Spinner from '../compnents/Spinner'
import BackButton from '../compnents/BackButton'
import TicketItem from '../compnents/TicketItem'

// Tickets page to list out all tickets 

function Tickets() {
  const {tickets, isLoading, isSuccess} = useSelector(
    (state) => state.tickets
  )

  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      if(isSuccess) {
        dispatch(reset())
      }
    }
  }, [dispatch, isSuccess])

  useEffect(() => {
    dispatch(getTickets())
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <BackButton url='/' />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        {/* embed a component to display each ticket info */}
        {tickets.map((ticket) => {
          return <TicketItem key={ticket._id} ticket={ticket} />
        })}
      </div>
    </>
  )
}

export default Tickets