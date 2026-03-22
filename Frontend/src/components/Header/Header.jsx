import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, LayoutDashboard, FileText, Users, User,
  LogIn, UserPlus, LogOut, Menu, X, ChevronDown
} from 'lucide-react';

/**
 * Header — consistent sticky navbar used on ALL pages.
 * Emerald green design system: white bg, emerald logo, green active links.
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Link style helper
  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
      ? 'text-primary bg-primary/5 font-semibold'
      : 'text-gray-500 hover:text-primary hover:bg-primary/5'
    }`;

  const navLinks = [
    { to: user?.role === 'admin' ? '/admin' : '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { to: '/report-issue', label: 'Report Issue', icon: <FileText size={15} /> },
    { to: '/view-complaints', label: 'Community', icon: <Users size={15} /> },
    { to: '/profile', label: 'Profile', icon: <User size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md shadow-primary/10">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-extrabold text-xl tracking-tight group-hover:text-primary transition-colors">
            Clean<span className="text-primary">Street</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={linkClass(to)}>
              {icon} {label}
            </Link>
          ))}
        </div>

        {/* ── Auth Actions ── */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xs font-bold shadow">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700 font-medium">{user.name?.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                    Admin
                  </Link>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium"
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                <LogIn size={15} /> Login
              </Link>
              <Link to="/register"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                <UserPlus size={15} /> Register
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden text-gray-500 hover:text-primary p-2 rounded-lg hover:bg-primary/5 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-slide-down">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`${linkClass(to)} w-full`}>
              {icon} {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition w-full">
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl text-center justify-center transition-all hover:border-primary/40 hover:text-primary">
                  <LogIn size={15} /> Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl text-center justify-center transition-all">
                  <UserPlus size={15} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
