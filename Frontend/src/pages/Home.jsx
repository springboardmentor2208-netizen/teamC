import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { MapPin, Camera, CheckCircle, ArrowRight, Shield, Globe, Users } from 'lucide-react';
import axios from 'axios';

function Home() {
  const [stats, setStats] = useState({
    resolved: 1240,
    active: 350,
    users: 5000
  });

  // Fetch real stats if available, otherwise use defaults
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/complaints/stats');
        setStats({
          resolved: response.data.resolved || 1240,
          active: (response.data.totalIssues || 1590) - (response.data.resolved || 1240),
          users: 5000 // Mock user count if not available
        });
      } catch (error) {
        console.log('Using default stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#f56551] to-[#f78e7e] text-white py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="container mx-auto z-10 relative flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-sm">
              Clean Street
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light text-white/90 max-w-lg mx-auto md:mx-0">
              Report and track civic issues like garbage, potholes, and water leaks. Make your city cleaner, one click at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/report-issue">
                <Button className="px-8 py-6 text-lg font-bold bg-white text-[#f56551] hover:bg-gray-100 rounded-full shadow-lg transition-transform transform hover:scale-105">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/view-complaints">
                <Button variant="outline" className="px-8 py-6 text-lg font-semibold border-2 border-white text-[#f56551] hover:bg-white/10 rounded-full transition-all">
                  View Reports
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for Hero Image or Illustration */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-8 shadow-2xl animate-pulse-slow">
              <div className="text-9xl">🏙️</div>
              <div className="absolute -top-4 -right-4 bg-white text-[#f56551] p-4 rounded-xl shadow-lg animate-bounce">
                <span className="font-bold">✨ Clean City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Reporting a civic issue is easy. Just follow these three simple steps to make a difference.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Camera size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">1. Snap a Photo</h3>
              <p className="text-gray-600">Take a clear picture of the pothole, garbage, or issue you see on the street.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <MapPin size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">2. Report Location</h3>
              <p className="text-gray-600">Upload the photo and pin the location on our map so authorities can find it.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">3. Get Resolved</h3>
              <p className="text-gray-600">Track the status as local authorities fix the issue. Get notified when it's done!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913929-2b3a6412356a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Community Impact</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">Together with citizens like you, we are transforming our cities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-orange-500 mb-2">{stats.resolved}+</div>
              <div className="text-xl font-medium">Issues Resolved</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-400 mb-2">{stats.active}</div>
              <div className="text-xl font-medium">Active Reports</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-green-400 mb-2">{stats.users}+</div>
              <div className="text-xl font-medium">Citizens Engaged</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl max-w-4xl mx-auto border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-tr-full -ml-10 -mb-10 opacity-50"></div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to make a change?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">Join thousands of other citizens contributing to a better, cleaner environment. It only takes a minute.</p>
            <Link to="/register">
              <Button className="px-10 py-6 text-xl bg-[#f56551] text-white hover:bg-[#e0503d] rounded-full shadow-lg transition-all">
                Join CleanStreet Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">CleanStreet</h3>
            <p className="mb-6 max-w-md">Empowering citizens to build cleaner, safer, and smarter communities through technology and collaboration.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Shield size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Users size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#f56551] transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#f56551] transition-colors">Dashboard</Link></li>
              <li><Link to="/report-issue" className="hover:text-[#f56551] transition-colors">Report Issue</Link></li>
              <li><Link to="/view-complaints" className="hover:text-[#f56551] transition-colors">View Complaints</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-2">
              <li>help@cleanstreet.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Civic Center Dr</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} CleanStreet. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home
