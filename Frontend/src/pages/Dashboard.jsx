import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: 'User' })
  const [stats, setStats] = useState({
    totalIssues: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'))

      if (!storedUser || !storedUser.token) {
        navigate('/login')
        return
      }

      setUser(storedUser)

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${storedUser.token}`
          }
        }

        const statsRes = await axios.get(
          'http://localhost:5000/api/complaints/stats',
          config
        )
        setStats(statsRes.data)

        const complaintsRes = await axios.get(
          'http://localhost:5000/api/complaints/my',
          config
        )

        const sortedComplaints = complaintsRes.data
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 5)

        setRecentActivity(sortedComplaints)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <div className="text-gray-600">
            Welcome, {user.name}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Issues', value: stats.totalIssues, icon: '⚠️' },
            { label: 'Received', value: stats.pending, icon: '🕒' },
            { label: 'In Review', value: stats.inProgress, icon: '⚙️' },
            { label: 'Resolved', value: stats.resolved, icon: '✅' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center"
            >
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                {item.value}
              </h3>
              <p className="text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-gray-100 last:border-0 flex gap-4"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-100">
                      {activity.status === 'resolved'
                        ? '✅'
                        : activity.status === 'in_review'
                        ? '⚙️'
                        : '📩'}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-4">
              <Link to="/report-issue">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  + Report New Issue
                </Button>
              </Link>
              <Link to="/view-complaints">
                <Button variant="outline" className="w-full">
                  ≡ View All Complaints
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                🗺️ Issue Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard