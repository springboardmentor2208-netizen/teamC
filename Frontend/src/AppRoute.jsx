import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import ComplaintForm from './pages/complaintforms/ComplaintForm'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ViewComplaints from './pages/ViewComplaints'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyOTP from './pages/auth/VerifyOTP'
import AdminPanel from './pages/AdminPanel'

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
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </div>
  )
}

export default AppRoute
