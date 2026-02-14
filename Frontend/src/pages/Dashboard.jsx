import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'User' });
    const [stats, setStats] = useState({
        totalIssues: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Simulate fetching user and stats data
        // In real implementation, fetch from API
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            // Redirect to login if not logged in
            navigate('/login');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="text-gray-600">Welcome, {user.name}</div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.totalIssues}</h3>
                        <p className="text-gray-500">Total Issues</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                        <div className="p-4 bg-blue-50 rounded-full mb-4">
                            <span className="text-2xl text-blue-500">🕒</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.pending}</h3>
                        <p className="text-gray-500">Pending</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                        <div className="p-4 bg-yellow-50 rounded-full mb-4">
                            <span className="text-2xl text-yellow-500">⚙️</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.inProgress}</h3>
                        <p className="text-gray-500">In Progress</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                        <div className="p-4 bg-green-50 rounded-full mb-4">
                            <span className="text-2xl text-green-500">✅</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.resolved}</h3>
                        <p className="text-gray-500">Resolved</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div key={index} className="p-4 border-b border-gray-100 last:border-0 flex items-start gap-4">
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-600 text-xs mt-1">+</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                                            <p className="text-sm text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No recent activity found.
                                </div>
                            )}
                            {/* Mock Data for visual matching */}
                            <div className="p-4 border-b border-gray-100 flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-full text-green-600 text-xs mt-1">✓</div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Pothole on Main Street resolved</h4>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="p-4 border-b border-gray-100 flex items-start gap-4">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600 text-xs mt-1">+</div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">New streetlight issue reported</h4>
                                    <p className="text-sm text-gray-500">4 hours ago</p>
                                </div>
                            </div>
                            <div className="p-4 border-b border-gray-100 flex items-start gap-4">
                                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 text-xs mt-1">✎</div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Garbage dump complaint updated</h4>
                                    <p className="text-sm text-gray-500">6 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="flex flex-col gap-4">
                            <Link to="/report-issue">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 flex items-center justify-center gap-2">
                                    <span>+</span> Report New Issue
                                </Button>
                            </Link>
                            <Link to="/view-complaints">
                                <Button variant="outline" className="w-full justify-start text-gray-700 border-gray-200 bg-white hover:bg-gray-50">
                                    <span className="mr-2">≡</span> View All Complaints
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start text-gray-700 border-gray-200 bg-white hover:bg-gray-50">
                                <span className="mr-2">🗺️</span> Issue Map
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
