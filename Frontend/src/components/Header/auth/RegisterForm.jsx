import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'

function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      setError('Please fill in all required fields')
      return
    }

    if (emailError) {
      setError('Please enter a valid email')
      return
    }

    setError('')

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        name,
        email,
        location,
        password
      })

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Register for CleanStreet
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              const value = e.target.value
              setEmail(value)
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              setEmailError(
                emailRegex.test(value) ? '' : 'Invalid email format'
              )
            }}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            placeholder="Enter your city / area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <Button
          type="submit"
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-[#f56551] rounded-full shadow-lg hover:bg-[#C9442A] transition"
        >
          Register
        </Button>
      </form>

      <p className="text-center text-lg mt-4">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm