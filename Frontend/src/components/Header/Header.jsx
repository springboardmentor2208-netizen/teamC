import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <nav className='flex justify-between items-center px-8 py-4 border-b'>
        <div className='text-[#f56551] font-bold text-2xl'>CleanStreet</div>
        <div className='flex gap-6'>
          <Link to="/dashboard" className='nav_underline cursor-pointer'>Dashboard</Link>
          <Link to="/report-issue" className='nav_underline cursor-pointer'>Report Issue</Link>
          <span className='nav_underline cursor-pointer'>View Complaints</span>
          <Link to="/profile" className='nav_underline cursor-pointer'>Profile</Link>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Welcome, {user.name || user.username}</span>
              <Button onClick={handleLogout} className="px-6 py-2 text-lg font-semibold text-white transition bg-gray-600 rounded-full shadow-lg hover:bg-gray-700 transition-duration-200">Logout</Button>
            </div>
          ) : (
            <>
              <Link to="/login"><Button className="px-6 py-3 w-[130px] text-lg mr-3 font-semibold text-white bg-[#f56551] rounded-full hover:bg-[#C9442A] hover:scale-110">Login</Button></Link>
              <Link to="/register"><Button className="px-6 py-3 w-[130px] text-lg mr-3 font-semibold text-white bg-[#f56551] rounded-full hover:bg-[#C9442A] hover:scale-110">Register</Button></Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Header
