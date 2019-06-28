import VueRouter from 'vue-router'
import Content from '../components/content/Content'
import { packages, singlePackage } from './packages'
import { bookings, singleBooking } from './bookings'
import Profile from '../components/content/profile/Profile'
import Account from '../components/content/account/Account'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

const routes = [
    { path: "/", component: Content },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    packages,
    singlePackage,
    bookings,
    singleBooking,
    { path: '/profile', component: Profile },
    { path: '/account', component: Account },
    { path: '*', redirect: '/' }]

const router = new VueRouter({
    routes, mode: 'history'
})

export default router