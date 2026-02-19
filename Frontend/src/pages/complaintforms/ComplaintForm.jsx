import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '../../components/ui/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'

const ComplaintForm = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    issueType: '',
    priority: '',
    address: '',
    landmark: '',
    description: '',
    location: null,
    photo: ''
  })

  const [position, setPosition] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser)
    } else {
      alert('Please login to report an issue.')
      navigate('/login')
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng)
        setFormData((prev) => ({ ...prev, location: e.latlng }))
      }
    })

    return position ? <Marker position={position} /> : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('You must be logged in to submit a complaint.')
      return
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      await axios.post(
        'http://localhost:5000/api/complaints',
        formData,
        config
      )

      alert('Complaint Submitted Successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert(
        error.response?.data?.message ||
          'Failed to submit complaint'
      )
    }
  }

  return (
    <div>
      <Header />

      <div className="container mx-auto p-8 bg-[#fdecea] min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Report a Civic Issue
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Issue Type
                </label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="garbage">Garbage</option>
                  <option value="pothole">Pothole</option>
                  <option value="street_light">Street Light</option>
                  <option value="water_leakage">
                    Water Leakage
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block font-medium mb-1">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block font-medium mb-1">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full p-2 border rounded-md"
              />
              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="mt-2 h-32 rounded-md border"
                />
              )}
            </div>

            {/* Map */}
            <div>
              <label className="block font-medium mb-2">
                Location on Map
              </label>
              <div className="h-64 w-full rounded-md overflow-hidden border">
                <MapContainer
                  center={[40.7128, -74.006]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Click on the map to select the location
              </p>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-[300px] py-3 text-lg bg-[#f56551] hover:bg-[#C9442A] text-white rounded-full"
              >
                Submit Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ComplaintForm