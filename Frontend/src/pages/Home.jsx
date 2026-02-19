import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { MapPin, Camera, CheckCircle, Shield, Globe, Users } from 'lucide-react'
import axios from 'axios'

function Home() {
  const [stats, setStats] = useState({
    resolved: 1240,
    active: 350,
    users: 5000
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/complaints/stats'
        )
        setStats({
          resolved: response.data.resolved || 1240,
          active:
            (response.data.totalIssues || 1590) -
            (response.data.resolved || 1240),
          users: 5000
        })
      } catch {
        console.log('Using default stats')
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#f56551] to-[#f78e7e] text-white py-24 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-6">Clean Street</h1>
            <p className="text-xl mb-8 max-w-lg">
              Report and track civic issues like garbage, potholes, and water leaks.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/report-issue">
                <Button className="px-8 py-6 bg-white text-[#f56551] rounded-full">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/view-complaints">
                <Button variant="outline" className="px-8 py-6">
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex text-8xl">🏙️</div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl shadow-sm">
              <Camera size={40} className="mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Snap a Photo</h3>
              <p>Capture the issue clearly</p>
            </div>
            <div className="p-6 rounded-xl shadow-sm">
              <MapPin size={40} className="mx-auto mb-4 text-orange-600" />
              <h3 className="font-bold mb-2">Add Location</h3>
              <p>Pin the exact place</p>
            </div>
            <div className="p-6 rounded-xl shadow-sm">
              <CheckCircle size={40} className="mx-auto mb-4 text-green-600" />
              <h3 className="font-bold mb-2">Get Resolved</h3>
              <p>Track progress easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 text-center gap-8">
          <div>
            <div className="text-4xl font-bold text-orange-400">
              {stats.resolved}+
            </div>
            Issues Resolved
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400">
              {stats.active}
            </div>
            Active Reports
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400">
              {stats.users}+
            </div>
            Citizens Engaged
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to make a change?
        </h2>
        <Link to="/register">
          <Button className="px-10 py-6 bg-[#f56551] text-white rounded-full">
            Join CleanStreet
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-2">CleanStreet</h3>
            <p>Building cleaner communities together.</p>
          </div>
          <div className="flex gap-4">
            <Globe />
            <Shield />
            <Users />
          </div>
          <div>© {new Date().getFullYear()} CleanStreet</div>
        </div>
      </footer>
    </div>
  )
}

export default Home