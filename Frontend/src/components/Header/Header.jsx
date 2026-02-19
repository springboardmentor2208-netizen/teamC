import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const Header = () => {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-[#f56551] font-bold text-2xl tracking-tight"
        >
          CleanStreet
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-[#f56551] font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/report-issue"
            className="text-gray-600 hover:text-[#f56551] font-medium transition-colors"
          >
            Report Issue
          </Link>
          <Link
            to="/view-complaints"
            className="text-gray-600 hover:text-[#f56551] font-medium transition-colors"
          >
            View Complaints
          </Link>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-[#f56551] font-medium transition-colors"
          >
            Profile
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                Hello, {user.name}
              </span>
              <Button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#f56551] rounded-full shadow-md hover:bg-[#e0503d] transition-all"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <Button className="px-5 py-2 text-sm font-semibold text-[#f56551] bg-white border border-[#f56551] rounded-full hover:bg-gray-50 transition-all">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="px-5 py-2 text-sm font-semibold text-white bg-[#f56551] rounded-full shadow-md hover:bg-[#e0503d] transition-all">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-[#f56551] focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 shadow-lg absolute w-full left-0 top-full">
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-[#f56551] font-medium text-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/report-issue"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-[#f56551] font-medium text-lg"
            >
              Report Issue
            </Link>
            <Link
              to="/view-complaints"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-[#f56551] font-medium text-lg"
            >
              View Complaints
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-[#f56551] font-medium text-lg"
            >
              Profile
            </Link>

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="flex flex-col gap-3">
                  <span className="text-gray-600 font-medium">
                    Hello, {user.name}
                  </span>
                  <Button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full py-2 text-white bg-[#f56551] rounded-lg"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full text-[#f56551] border border-[#f56551] py-2 rounded-lg">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full text-white bg-[#f56551] py-2 rounded-lg">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header