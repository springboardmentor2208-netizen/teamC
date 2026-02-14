import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import ComplaintForm from './pages/complaintforms/ComplaintForm'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ViewComplaints from './pages/ViewComplaints'

function AppRoute() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/report-issue' element={<ComplaintForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/view-complaints' element={<ViewComplaints />} />
      </Routes>
    </div>
  )
}

export default AppRoute
