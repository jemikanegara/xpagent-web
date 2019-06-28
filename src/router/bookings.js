import AllBooking from '../components/content/booking/AllBooking'
import SingleBooking from '../components/content/booking/SingleBooking'

export const bookings = { path: "/bookings", component: AllBooking }

export const singleBooking = { path: "/booking/:id", component: SingleBooking }