import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import { Button } from '../components/ui/button'
import { Lock, Shield, X, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

const Profile = () => {
  const [user, setUser] = useState({})
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (!storedUser?.token) {
        window.location.href = '/login'
        return
      }

      try {
        const res = await axios.get(
          'http://localhost:5000/api/users/me',
          {
            headers: {
              Authorization: `Bearer ${storedUser.token}`
            }
          }
        )
        setUser(res.data)
        setFormData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const storedUser = JSON.parse(localStorage.getItem('user'))

    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`
          }
        }
      )
      setUser(res.data)
      localStorage.setItem(
        'user',
        JSON.stringify({ ...storedUser, ...res.data })
      )
      setIsEditing(false)
      alert('Profile updated')
    } catch {
      alert('Update failed')
    }
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div>
      <Header />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
              {user.name?.charAt(0)}
            </div>
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <span className="inline-block mt-3 px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {user.role || 'user'}
            </span>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Account Information</h2>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                readOnly={!isEditing}
                className="border p-2 rounded"
                placeholder="Name"
              />
              <input
                name="email"
                value={formData.email || ''}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />
              <input
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                readOnly={!isEditing}
                className="border p-2 rounded md:col-span-2"
                placeholder="Location"
              />

              {isEditing && (
                <div className="md:col-span-2 text-right">
                  <Button type="submit" className="bg-blue-600 text-white">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>

            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
                className="flex gap-2"
              >
                <Lock size={18} /> Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X />
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}

            <input
              type="password"
              placeholder="Current Password"
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 mb-4 rounded"
            />

            <Button className="w-full bg-blue-600 text-white">
              Update Password
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile