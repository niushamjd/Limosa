import React from 'react'
import { Routes, Route ,Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from './../pages/Profile'
import Itineraries from '../pages/Itineraries'
import ForgotPassword from '../pages/ResetPassword'
import UpdatePassword from '../pages/UpdatePassword'
import ItineraryDetails from '../pages/ItineraryDetails'
import Interest from '../pages/Interest'
import SearhResultList from '../pages/SearchResultList'
import Register from '../pages/Register'
import ThankYou from '../pages/ThankYou'
import EditProfile from '../pages/EditProfile'
import ViewItinerary from '../pages/ViewItinerary'
import TravelGroup from '../pages/TravelGroup'
import ViewPastItinerary from '../pages/ViewPastItinerary'
import Connect from '../pages/Connect'
import Itinerary from '../pages/Itinerary'
import Business from '../pages/Business'
import Featured from '../pages/Featured'


const Routers = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to ='/home' />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-itinerary" element={<Itineraries />} />
        <Route path="/new-itinerary/:id" element={<ItineraryDetails />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/tours/search" element={<SearhResultList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<UpdatePassword />} />
        <Route path='/interest' element={<Interest />}></Route>
        <Route path='/editprofile' element={<EditProfile />}></Route>
        <Route path="/viewItinerary" element={<ViewItinerary />}></Route>
        <Route path="/travelgroup" element={<TravelGroup />}></Route>
        <Route path="/viewPastItinerary" element={<ViewPastItinerary />}></Route>
        <Route path="/connect" element={<Connect />}></Route>
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/business" element={<Business />} />
        <Route path="/featured" element={<Featured />} />




    </Routes>
  )
}

export default Routers