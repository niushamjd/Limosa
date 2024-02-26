import React from 'react'
import { Routes, Route ,Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from './../pages/Profile'
import Itineraries from '../pages/Itineraries'

import ItineraryDetails from '../pages/ItineraryDetails'

import SearhResultList from '../pages/SearchResultList'
import Register from '../pages/Register'
import ThankYou from '../pages/ThankYou'

const Routers = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to ='/home' />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/itineraries/:id" element={<ItineraryDetails />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/tours/search" element={<SearhResultList />} />


    </Routes>
  )
}

export default Routers