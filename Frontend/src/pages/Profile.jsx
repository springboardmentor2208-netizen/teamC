import React, { useState } from 'react';
import Header from '../components/Header/Header';
import { Button } from '../components/ui/button';

const Profile = () => {
    const [user, setUser] = useState({
        name: 'Demo User',
        username: 'demo_user',
        email: 'demo@cleanstreet.com',
        phone: '+1-555-123-4567',
        location: 'Downtown District',
        role: 'Citizen',
        bio: 'Active citizen helping to improve our community through CleanStreet reporting.'
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit profile</h1>

                <div className="mt-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                    <p className="text-gray-500">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - User Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-fit">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 relative">
                            DU
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-gray-200">
                                📷
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">@{user.username}</p>

                        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                            {user.role}
                        </span>

                        <p className="text-gray-600 text-sm mb-4">
                            {user.bio}
                        </p>

                        <p className="text-gray-400 text-xs">
                            Member since 7/3/2025
                        </p>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-100 p-2 rounded-full text-blue-600">👤</span>
                                        <h3 className="text-xl font-bold text-gray-800">Account Information</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm ml-10">Update your personal details</p>
                                </div>
                                <Button variant="outline" className="text-gray-600 border-gray-300">
                                    ✎ Edit
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input type="text" value={user.username} className="w-full p-2 border border-gray-200 rounded text-gray-500 bg-gray-50" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="text" value={user.email} className="w-full p-2 border border-gray-200 rounded text-gray-500 bg-gray-50" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" value={user.name} className="w-full p-2 border border-gray-200 rounded text-gray-500 bg-gray-50" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="text" value={user.phone} className="w-full p-2 border border-gray-200 rounded text-gray-500 bg-gray-50" readOnly />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" value={user.location} className="w-full p-2 border border-gray-200 rounded text-gray-500 bg-gray-50" readOnly />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea rows="3" className="w-full p-2 border border-gray-200 rounded text-gray-500 bg-gray-50" readOnly value={user.bio}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-red-100 p-2 rounded-full text-red-500">🔒</span>
                                <h3 className="text-xl font-bold text-gray-800">Security Settings</h3>
                            </div>
                            <p className="text-gray-500 text-sm ml-10 mb-6">Manage your account security and privacy</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full justify-center py-6 text-gray-700 border-gray-200">
                                    🔒 Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-center py-6 text-gray-700 border-gray-200">
                                    🛡️ Privacy Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
